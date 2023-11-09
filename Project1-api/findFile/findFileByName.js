const path = require('path');
const { readdir } = require('fs/promises');

module.exports = async (dir, name) => {
    const matchedFiles = [];


    const files = await readdir('./'+dir);

    
    for (const fileName of files) {
        
        if (fileName === name) {
            matchedFiles.push(fileName);
        }
    }

    

    if(matchedFiles.length > 0) {
        return true; 
    } else {
        return false; 
    }
} 