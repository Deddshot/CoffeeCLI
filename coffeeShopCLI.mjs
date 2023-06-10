
import readline from "readline";
import boxen from "boxen";
import chalk from "chalk";
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

let currentURL = "https://api.weatherapi.com/v1/current.json?key=a7630abefc7e4fd5830150733230306 &q=73112";
let futureURL =  "http://api.weatherapi.com/v1/forecast.json?key=a7630abefc7e4fd5830150733230306 &q=73112&days=8"

let orderedItems = [];

let menu = [
{
    name: "Hot Chocolate",
    type: "Hot Drink",
    price: 14.99
},
{
    name: "Cold Shmocolate",
    type: "Cold Drink",
    price: 12.25
},
{
    name: "Baguel", //Pronounced "Bage-Well"
    type: "Hot Food",
    price: 8.99
},
{
    name: "Iced Cream",
    type: "Cold Food",
    price: 3.00
}
]



function listItems(){
    console.log(menu.map(x => x));
}


function addItem(itemName){
    let orderedItem = "";
    !!menu.find((x, i) => {
        if(x.name.toLowerCase() === itemName.toLowerCase()){
            orderedItem = x.name;
            console.log(orderedItem + " added\n");
            orderedItems.push(orderedItem);
            prompt();
        }
        else if (i == menu.length - 1 && orderedItem == "") {
            console.log("No item by that name!\n");
            prompt();
        }
        })   
}

function checkOut(){
    let total = 0;
    if (orderedItems.length === 0){
       console.log("\nNothing to checkout!\n");
    }
    else {
        console.log(orderedItems);
        orderedItems.map(x => {
            menu.find(z => {
                if(z.name === x){                 
                    total += z.price;                   
                }
            })
        })
        console.log(`\nYour total is $${(Math.round(total * 100) / 100).toFixed(2)} for ${orderedItems.length} ` + (orderedItems.length == 1 ? "item" : "items") + `\n`);
}
    }
    

  async function suggest() {
    let currentTemp = undefined; //Variable that will store the current temperature once it's been returned by the API (used in a try/catch to keep asking user until a ZIP works)

    while (currentTemp == undefined){ //While the currentTemp hasn't received anything usable...
      try { //Try the code to retrieve the ZIP and use it with the API
        const zipCode = await new Promise((resolve) => { //ZIP is retrieve by a readline, put inside of a promise due to rl being async
          rl.question("\nPlease enter your ZIP code: ", (answer) => { //Request ZIP
            if(/^\d{5}$/.test(answer)){ //If the ZIP code matches the 5 digit format...
              resolve(answer); //...accept the user's input
            }
            else{ //If ZIP is anything *other* than 5 digits...
              console.log("Service requires a 5-digit US ZIP!\n"); //...Inform the user that their input doesn't fit the required format...
              prompt(); //...and prompt user again to see if they'd like to try another suggestion, or do something else
            }
          });
        });

        const lastZip = currentURL.substring(currentURL.lastIndexOf('=') + 1, (currentURL.lastIndexOf('=') + 6)); //Gets the ZIP already in the currentURL, which will ALWAYS follow the last equals sign per the API's URL format.
        //The above code works because the user can only enter 5 digits in the first place, meaning it will always be the correct char count even if their input is invalid

        //console.log(`Last zip code was ${lastZip}`);

        //console.log(zipCode);
    
        currentURL = (currentURL.replace(lastZip, zipCode)); //Replace the last ZIP code used (retrieved earlier) with the one the user entered that validated.
        
        //console.log(currentURL);
    
        
        const currentWeatherResponse = await fetch(currentURL); //Attempt to fetch the URL with the alteration to ZIP made
        const json = await currentWeatherResponse.json(); //unwrap the promise the original promise was wrapped in

        currentTemp = json.current.temp_f; //Set currentTemp to the value retrieved from the API (if this is undefined, we just jump to the catch)
        console.log(`\nThe current temperature is ${currentTemp}.`); //Display the current temp
      } catch (error) {
        console.log("ZIP not found in database!"); //Notify the user their ZIP was not legitimate 
        prompt(); //Ask for a ZIP code again
      }
    }
    
  
    let tempArray;
    if (currentTemp > 70) {
      tempArray = menu.filter(x => x.type.toLowerCase().includes("cold"));
    } else {
      tempArray = menu.filter(x => x.type.toLowerCase().includes("hot"));
    }
  
    const recommendedItem = tempArray[Math.floor(Math.random() * tempArray.length)];

    console.log("Perfect for " + (/^[aeiouAEIOU]/.test(recommendedItem.name[0]) ? "an " : "a ") + recommendedItem.name + "!")
  
    console.log(recommendedItem);
  
    rl.question(`Would you like to add ${recommendedItem.name} to your order? Y/N\n`, (answer) => {
        if (answer.toLowerCase() === "y") {
          addItem(recommendedItem.name);
        } else {
        
        }
        prompt();
      }
    );
  }
  
  async function futureSuggest() {

    let futureTemp = undefined;

    while (futureTemp == undefined){ //While the currentTemp hasn't received anything usable...
      try { //Try the code to retrieve the ZIP and use it with the API
        const zipCode = await new Promise((resolve) => { //ZIP is retrieve by a readline, put inside of a promise due to rl being async
          rl.question("\nPlease enter your ZIP code: ", (answer) => { //Request ZIP
            if(/^\d{5}$/.test(answer)){ //If the ZIP code matches the 5 digit format...
              resolve(answer); //...accept the user's input
            }
            else{ //If ZIP is anything *other* than 5 digits...
              console.log("Service requires a 5-digit US ZIP!\n"); //...Inform the user that their input doesn't fit the required format...
              prompt(); //...and prompt user again to see if they'd like to try another suggestion, or do something else
            }
          });
        });

        const lastZip = futureURL.substring(futureURL.lastIndexOf('=') - 10, (futureURL.lastIndexOf('=') - 5)); //Gets the zip *from* the last equals sign, which is now for days. This is horribly ugly but it should work just fine
        //The above code works because the user can only enter 5 digits in the first place, meaning it will always be the correct char count even if their input is invalid

        //console.log(`Last zip code was ${lastZip}`);

        //console.log(zipCode);
    
        futureURL = (futureURL.replace(lastZip, zipCode)); //Replace the last ZIP code used (retrieved earlier) with the one the user entered that validated.
        
        //console.log(futureURL);

        const futureWeatherResponse = await fetch(futureURL); //Attempt to fetch the URL with the alteration to ZIP made
        const json = await futureWeatherResponse.json(); //unwrap the promise the original promise was wrapped in

        futureURL = (futureURL.replace(lastZip, zipCode));

        const days = await new Promise((resolve) => {
          rl.question("How many days from now would you like this suggestion for? (Max 7): ", (answer) => {
            if (/[1-7]/.test(answer)){
              resolve(answer);
            }
            else{
              console.log("That is not a valid number!\n");
              prompt();
            }
          });
        });

        futureTemp = json.forecast.forecastday[days].day.maxtemp_f; //Set currentTemp to the value retrieved from the API (if this is undefined, we just jump to the catch)

        console.log(`\nOn ${json.forecast.forecastday[days].date}, the temperature will be ${futureTemp}F\xB0`) //String that gives the user the date they've reqeusted back to them and tells the temp in Fahrenheit 
      } catch (error) {
        console.log("ZIP was not found in database!"); //Notify the user their ZIP was not legitimate 
        return prompt(); //Ask for a ZIP code again
      }
    } 
    //console.log(`The temperature will be ${futureTemp} F\xB0`);
    //console.log(`This is for ${json.forecast.forecastday[days].date}`) 
    let tempArray;
    if (futureTemp > 70) {
      tempArray = menu.filter(x => x.type.toLowerCase().includes("cold"));
    } else {
      tempArray = menu.filter(x => x.type.toLowerCase().includes("hot"));
    }
  
    const recommendedItem = tempArray[Math.floor(Math.random() * tempArray.length)];

    console.log("Perfect for " + (/^[aeiouAEIOU]/.test(recommendedItem.name[0]) ? "an " : "a ") + recommendedItem.name + "!"); //String to tell the user what they have; slight change depending on if it begins with a vowel
  
    console.log(recommendedItem);
  
    rl.question(`Would you like to add ${recommendedItem.name} to your order? Y/N\n`, (answer) => {
      if (answer.toLowerCase() === "y") {
        addItem(recommendedItem.name);
      } else {
       
      }
      prompt();
    });
  }


var shortCommands = "Commands: O = Order, C = Checkout, S = Suggest a Drink, F = Suggest a Future Drink, E = Exit";

function prompt() {
    rl.question(
      `What would you like to do?\n\n${shortCommands}\n\n`,
      (answer) => {
        // your code here
        if (answer.toLowerCase() === "o") {
            listItems();
            rl.question("Please enter the name of the item you'd like: ", ((answer) => addItem(answer)));
        }
        else if (answer.toLowerCase() === "c") {
            checkOut();
            prompt(); // recursion to ask the user again
        }
        else if (answer.toLowerCase() === "s") {
          suggest();
        }
        else if (answer.toLowerCase() === "f") {
          futureSuggest();
        } else if (answer.toLowerCase() === "e") {
          rl.close();
        } else {
          console.log(`${shortCommands}`);
          prompt();
        }
        // console.log("After: " + answer);
      }
    );
  }
  
  prompt();