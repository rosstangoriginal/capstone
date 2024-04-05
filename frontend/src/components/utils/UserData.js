export const UserData = [
    {
        id: 1,
        metric: "On Peak",
        usage: localStorage.getItem('totalOnPeak'),
    },
    {
        id: 2,
        metric: "Off Peak",
        usage: localStorage.getItem('totalOffPeak'),
    },
    {
        id: 3,
        metric: "Mid Peak",
        usage: localStorage.getItem('totalMidPeak'),
    },
]