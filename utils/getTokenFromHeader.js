const getTokenFormHeader = (req) =>
{
    const headerObj = req.headers;
    if (headerObj && headerObj["authorization"])
    {
        const token = headerObj["authorization"].split(" ")[1];
        if (token !== undefined)
        {
            return token
        } else
        {
            return false;            
        }
    }
    // const token = headerObj["authorization"].split(" ")[1];
    
}
module.exports = getTokenFormHeader;

// const getTokenFormHeader = req =>
// {
//     const headerObj = req.headers;
//     const token = headerObj["authorization"].split(" ")[1];
//     if (token !== undefined)
//     {
//         return token
//     } else
//     {
//         return false;            
//     }
// }
// module.exports = getTokenFormHeader;