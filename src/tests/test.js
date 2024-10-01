const batchSize = 100;
const totalSize = 1000;

let currentId = 1

const values = [];
for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `name-${currentId}`
    const age = currentId
    const address = `address-${currentId}`
    values.push([currentId, name, age, address])
    currentId++;        
}

console.log('VALUES ::: ', values)