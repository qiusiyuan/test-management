module.exports={
  isGroup: isGroup,
  formArg: formArg,
  getAddLst: getAddLst,
  cleanUpJobObject: cleanUpJobObject,
  getStats: getStats,
};
function isGroup(object){
  return object.subset !== undefined && object.subset !==null;
}

function formArg(argObj, childName){
  if(!isGroup(argObj)){
    argObj.subset=[{name: childName}]
  }else if(isGroup(argObj)){
    formArg(argObj.subset[0], childName);
  }
  return argObj;
}

function getAddLst(checkedTestTree){
  var result = [];
  checkedTestTree.forEach((test)=>{
    if(isGroup(test)){
      var addTest = {name:test.name};
      addTest.subset = getAddLst(test.subset);
      result.push(addTest)
    }else{
      if(test.checked){
        var addTest = {name:test.name};
        result.push(addTest);
      }
    }
  });
  cleanUpJobObject(result);
  return result;
}

function cleanUpJobObject(testTree){
  testTree.forEach((childTest) => {
    if (testObjectCanBeDeleted(childTest)){
      testTree.splice( testTree.indexOf(childTest), 1 );
    }
  });
}

function testObjectCanBeDeleted(testObject){
  if (!isGroup(testObject)){
    return false;
  }
  if(testObject.subset.length === 0 ){
    return true;
  }else{
    var deleteQueue = []
    testObject.subset.forEach((childTest)=>{
      if(testObjectCanBeDeleted(childTest)){
        deleteQueue.push(childTest);
      }
    })
    if (deleteQueue.length !== 0){
      deleteQueue.forEach((childTest)=>{
        testObject.subset.splice(testObject.subset.indexOf(childTest),1 );
      })
    }
    if (testObject.subset.length === 0){
      return true;
    }else{
      return false;
    }
  }
}

function getStats(testTree){ //get an array
  //return [success, failure, all]
  var success=0;
  var failure=0;
  var all=0;
  if(testTree.length === 0){
    return([success, failure, all]);
  }
  testTree.forEach((test)=>{
    if(!isGroup(test)){
      all++;
      if(test.status === "success"){
        success++;
      }else if(test.status === "failure"){
        failure++;
      }
    }else{
      var childStat = getStats(test.subset);
      success += childStat[0];
      failure += childStat[1];
      all += childStat[2];
    }
  });
  return ([success, failure, all]);
}