const fs = require("fs");

// Read the input.txt file
fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Cannot read data from the file:", err);
  } else {
    // Process the test cases from the input text
    dataDrivenTest(data);
  }
});

// Function to process test cases from a text string
function dataDrivenTest(inputText) {
  try {
    const testCases = inputText.trim().split("\n\n");
    //   console.log(testCases);
    const outputText = testCases.map(checkDataChange).join("\n");
    fs.writeFile("output.txt", outputText.replace(/^\s*[\r\n]/gm, ""), "utf8", (err) => {
      if (err) {
        console.error("Error writing to output.txt:", err);
      } else {
        console.log("output.txt file has been created successfully.");
      }
    });
  } catch (e) {
    console.error(`Could not process test cases! Please check your input data format and try again` + e.message);
    return "";
  }
}

function checkDataChange(dataInput) {
  const tasks = [];
  const dataLines = dataInput.trim().split("\n");
  //   console.log(dataLines);
  try {
    const testCaseNumber = parseInt(dataLines[0].trim().split(")")[0]);
    const numTasks = parseInt(dataLines[1].trim());
    let taskIndex = 2;
    //   console.log(testCaseNumber);
    //   console.log(numTasks);

    for (let i = 0; i < numTasks; i++) {
      const taskData = dataLines[taskIndex].trim().split(";");
      const input = taskData[0].split(",").map(Number);
      // console.log(input);
      const output = taskData[1].split(",").map(Number);
      tasks.push({ input, output });
      taskIndex++;
    }

    const initialDataChanged = dataLines[taskIndex].trim().split(",").map(Number);
    const executedTasks = executeTasks(tasks, initialDataChanged);
    // console.log(executedTasks);
    //check if executedTasks is not empty and return the output text

    if (executedTasks.length !== 0) {
      return (outputText = `${testCaseNumber})${executedTasks.join(",")}`);
    }
    // return outputText;
  } catch (e) {
    console.error(`Could not execute test case! Please check your input data format and try again` + e.message);
    return "";
  }
}

function executeTasks(tasks, initialDataChanged) {
  const executedTasks = new Set();
  const dataMap = new Map();

  for (let i = 0; i < tasks.length; i++) {
    dataMap.set(`d${i}`, tasks[i].output);
  }
  //   console.log(tasks);
  let tasksExecuted = false;
  while (!tasksExecuted) {
    tasksExecuted = true;
    // console.log(tasks[0].input);
    // console.log(initialDataChanged);
    // const inputKeys = tasks[0].input.map((_, i) => `d${tasks[0].input[i]}`);
    const result = isDataPresent(initialDataChanged, tasks[0].input);
    console.log(result);
    if (result == true) {
      // if (inputKeys.some((key) => dataMap.get(key) !== tasks[0].input[key])) {
      for (let i = 0; i < tasks.length; i++) {
        if (!executedTasks.has(i) && checkTaskExecution(dataMap, i)) {
          console.log("Task Index:", i);
          executeTask(i);
          executedTasks.add(i);
          tasksExecuted = false;
        }
      }
      // }
    }
  }

  function checkTaskExecution(inputData, taskIndex) {
    // console.log("Task Index:", taskIndex);
    // console.log("Input Data:", inputData);
    // console.log("Tasks:", tasks);
    const inputKeys = tasks[taskIndex].input.map((_, i) => `d${tasks[taskIndex].input[i]}`);
    // console.log("Input Keys:", inputKeys);
    const data1 = inputKeys.some((key) => dataMap.get(key) !== inputData[key]);
    // console.log(data1);
    return data1;
  }

  // Function to execute a task and update dataMap
  function executeTask(taskIndex) {
    const inputData = tasks[taskIndex].input.map((_, i) => dataMap.get(`d${tasks[taskIndex].input[i]}`));
    // console.log("Input Data:", inputData);
    const outputData = tasks[taskIndex].output;
    const taskFunction = defineTask(inputData, outputData);
    const newOutputData = taskFunction(inputData);
    for (let i = 0; i < outputData.length; i++) {
      dataMap.set(`d${outputData[i]}`, newOutputData[i]);
    }
  }
  return Array.from(executedTasks).sort((a, b) => a - b);
}

function defineTask(input, output) {
  return function (inputData) {
    return output.map((value, index) => value - inputData[index]);
  };
}

function isDataPresent(array1, array2) {
  const firstArray = array1.some((num1) => array2.some((num2) => areNumbersEqual(num1, num2)));
  const secondArray = array2.some((num2) => array1.some((num1) => areNumbersEqual(num2, num1)));
  // return array1.some((num1) => array2.some((num2) => areNumbersEqual(num1, num2)));
  // console.log("FirstArray", array1);
  // console.log("secondArray", array2);
  return firstArray || secondArray;

  function areNumbersEqual(num1, num2) {
    return num1 === num2;
  }
}
