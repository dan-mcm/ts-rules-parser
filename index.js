const { readFileSync, writeFile } = require('fs');

const rulesFileDirectory = './rules.ini'

const factions = [
    ";[S/F: GDI = GDI main faction]",
    ";[S/F: GDRR = GDI Rapid Response]",
    ";[S/F: GDSC = GDI Space Command]",
    ";[S/F: Nod = Nod main faction]",
    ";[S/F: NDCyber = Nod Heavy Cyber]",
    ";[S/F: NDBH = Nod Black Hand]",
    ";[S/F: For3 = Forgotten Hofati]",
    ";[S/F: Forgotten = Forgotten main faction]",
    ";[S/F: Militia = City-State Militia main faction]"
]

function main(filename) {
  const contents = readFileSync(filename, 'utf-8');
  const arr = contents.split(/\r?\n/);
  const jsonOutput = fadingDuskVehicleParser(arr)
  console.log('json: ', jsonOutput)
  console.log('type: ', typeof jsonOutput)
  writeFile("./rules.json", jsonOutput, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    })
  return arr;
}

function fadingDuskVehicleParser(rules){
    let startIndex = 0;
    let endIndex = 0;
    const output = []
    const trialObj = {}
    rules.map((line,i) => {
            if(factions.includes(line)){
                // console.log(`Hit! StartIndex ${line} at position ${i}`)
                startIndex=i;
                let cutArr = rules.slice(i)
                
                for (let i = 0; i < cutArr.length; i++) {
                    if (cutArr[i] === '' || cutArr[i] === undefined) { 
                        endIndex = startIndex+i
                        // console.log(`Hit! Blank entry EndIndex at position ${endIndex}`);
                        break;
                    }
                }

                // debuggin
                formatFactionObject(rules.slice(startIndex+2,endIndex))
                // startIndex+2 goes past the ---- linebreak below the faction titlespace
                
                trialObj[line.substring(line.indexOf('=') + 2, line.length - 1)] = formatFactionObject(rules.slice(startIndex+2,endIndex));

                output.push(
                    {
                        [line.substring(line.indexOf('=') + 2, line.length - 1)]: formatFactionObject(rules.slice(startIndex+2,endIndex))
                    }
                )
            }
        }
    )
    // debuggin
    return JSON.stringify(trialObj)
}

function formatFactionObject(arr){
    // const output = {};
    const outputArr = [];
    arr.map((entry, index) => {
        // skipping commented entries
        if(!entry.startsWith(";")){
            let unitCode = entry.substring(0, entry.indexOf(';;')).substring(0, entry.indexOf('='));
            let unitName = entry.includes(' - ') ? entry.substring(entry.indexOf(';;') + 2, entry.indexOf(' - ')) : entry.substring(entry.indexOf(';;') + 2);
            let unitDescription = entry.includes(' - ') ? entry.substring(entry.indexOf(' - ') + 3) : null;
            let rawLine = entry;
            // console.log(`Unit Code: ${unitCode}`);
            // console.log(`Unit Name: ${unitDescription}`);
            let newObj = {
                code: unitCode,
                name: unitName,
                description: unitDescription,
                raw: rawLine
            }
            // output[unitCode] = newObj
            outputArr.push(newObj)
        }
    })
    return outputArr
}

main(rulesFileDirectory);