import { SSM } from "@aws-sdk/client-ssm";
import credentials from "./fabric-contract/credentials.json";
import bytecode from "./fabric-contract/bytecode.json";
import abi from "./fabric-contract/abi.json";

const ssm = new SSM({
    region: 'us-east-1',
    credentials: {
        accessKeyId: credentials['accessKeyId'],
        secretAccessKey: credentials['secretAccessKey']
    }
});

const instanceIDs = [
    "i-09614df9eb872e084", //for energy instance
    "i-08970e29589695db3"  //for second instance
]

function createCommand(params, type) {
    let keys = Object.keys(params)
    let command = "docker exec cli peer chaincode ";
    let commandList = [];
    if (type == "Invoke") {
        command += "invoke ";
    } else if (type == "Query") {
        command += "query ";
    } else {
        return;
    }
    
    for (let k in keys) {
        commandList.push(keys[k] + " " + params[keys[k]]);
    }

    command += commandList.join(" ");
    return command;
}

function createArgs(params) {
    let prefix = "\'{\"Args\":[";
    let suffix = "]}\'";
    let argList = []
    for (let a in params) {
        argList.push("\"" + params[a] + "\"");
    }

    let args = prefix + argList.join(', ') + suffix;
    return args;
}


let channelID = "mychannel";
let chaincodeName = "evmtest";
let certificatePath = "/opt/home/managedblockchain-tls-chain.pem";
let orderer = "orderer.n-wvmd3nwc6fa33fciqr4lhnld3e.managedblockchain.us-east-1.amazonaws.com:30001"
let zeroAddress = "0000000000000000000000000000000000000000";

//returns the user's account address
export async function userAccountAddressCommand() {
    let params = {
        '-n': chaincodeName,
        '-C': channelID,
        '-c': createArgs(['account'])
    };

    let command = createCommand(params, "Query");
    let data = await runCommand(command);
    let userAccountAddress = data.StandardOutputContent;

    return userAccountAddress;
}

//deploys the smart contract on the channel. returns the contract address
export async function deployCommand(contractBytecode) {
    let params = {
        '--tls': '',
        '--cafile': certificatePath,
        '-n': chaincodeName,
        '-C': channelID,
        '-c': createArgs([zeroAddress, contractBytecode])
    };

    let command = createCommand(params, "Invoke");
    let data = await runCommand(command);
    let result = data.StandardErrorContent;

    let regex = /payload:"\w{1,}"/;
    let payload = regex.exec(result)[0];
    let contractAddress = payload.replace("payload:", "").replaceAll("\"", "");
    return contractAddress;
}

export async function getBytecodeCommand(contractAddress) {
    let params = {
        '-n': chaincodeName,
        '-C': channelID,
        '-c': createArgs(['getCode', contractAddress])
    };

    let command = createCommand(params, "Query");
    let data = await runCommand(command);
    let bytecode = data.StandardOutputContent.replace("\n", "");
    return bytecode;
}

export async function invokeSmartContract(contractAddress, functionHash) {
    let params = {
        '-n': chaincodeName,
        '-C': channelID,
        '-c': createArgs([contractAddress, functionHash]),
        '--tls': '',
        '--cafile': certificatePath,
    };

    let command = createCommand(params, "Invoke");
    let data = await runCommand(command);
    return data;//.StandardOutputContent.replace("\n", "");
}

export async function querySmartContract(contractAddress, functionHash) {
    let params = {
        '-n': chaincodeName,
        '-C': channelID,
        '-c': createArgs([contractAddress, functionHash]),
        '--hex': '',
    };

    let command = createCommand(params, "Query");
    let data = await runCommand(command);
    return data;//.StandardOutputContent.replace("\n", "");
}

export function getABI() {
    let data = {};
    for (let m in abi) {
        if ("name" in abi[m]) {
            let name = abi[m]["name"];
            data[name] = abi[m];
        } else {
            data["constructor"] = abi[m];
        }
    }
    return data;
}

export function getBytecode() {
    return bytecode["bytecode"];
}

//parameters == array of input values
export function getFunctionHash(functionName, parameters, web3, abi) {
    return web3.eth.abi.encodeFunctionCall(abi[functionName], parameters).replace("0x", "")
}

async function runCommand(command) {
    return new Promise((resolve, reject) => {
        console.log("\n> " + command);
        const ssmParams = {
            DocumentName: 'AWS-RunShellScript', // Use the Shell script document provided by AWS
            InstanceIds: [instanceIDs[0]], // Provide the ID of your EC2 instance
            Parameters: {
                commands: [command]
            }
        };

        ssm.sendCommand(ssmParams, function(err, data) {
            if (err) {
                console.log(err, err.stack);
            } else {
                const commandId = data.Command.CommandId;
                console.log("Command ID:", commandId);
            
                const getCommandParams = {
                    CommandId: commandId,
                    InstanceId: ssmParams.InstanceIds[0] // Assuming only one instance ID provided
                };
            
                const interval = setInterval(function() {
                    ssm.getCommandInvocation(getCommandParams, function(err, data) {
                        if (err) {
                            console.log(err, err.stack);
                            clearInterval(interval);
                            resolve(err)
                        } else if (data.Status === 'Success' || data.Status === 'Failed' || data.Status === 'Canceled') {
                            console.log("Command status:", data.Status);
                            clearInterval(interval);
                            resolve(data);
                        }
                    });
                }, 5000); // Poll every 5 seconds for command status
            }
        });
    });
}