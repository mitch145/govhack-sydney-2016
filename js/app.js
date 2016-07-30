var app = angular.module("MyTopicList", []);
app.controller("myCtrl", function($scope) {

  $scope.searchTopics = '';
  $scope.started = false;
  $scope.test = "testing";

  $scope.start = function(scope){
    initPlots($scope);
    $scope.started = true;
  };

  initPlots = function($scope){
    console.log($scope.topics);
    for(i = 0; i < $scope.topics.length; i++){
      name = $scope.topics[i].name;
      name = "#"+name;
      $(name).slideUp("fast", function(){});
    }
  };

  // Initialise Firebase
  var config = {
    apiKey: "AIzaSyDxNwZ6vnmnGyHqVQTNPCbhYSCWp6LFYI8",
    authDomain: "govhack-e9396.firebaseapp.com",
    databaseURL: "https://govhack-e9396.firebaseio.com",
    storageBucket: "govhack-e9396.appspot.com",
  };
  firebase.initializeApp(config);

  // Get a ref to the database service
  var database = firebase.database();

  // Initialise $scope.topics
  database.ref('topics/').once('value', function(snapshot) {
    $scope.$apply(function() {
      
      $scope.topics = [];
      snapshot.forEach(function(childSnapshot) {
        $scope.topics.push(childSnapshot.val());
      });
    });
  });
  


  function writeNewTopic(name, anger, disgust, fear, joy, sadness) {

    // Get a key for a new Post.
    var newPostKey = database.ref().child('posts').push().key;

    // A post entry.
    var postData = {
      key: newPostKey,
      name: name,
      sentiment: {
        anger: anger,
        disgust: disgust,
        fear: fear,
        joy: joy,
        sadness: sadness
      }
    };

    // Write the new post's data
    var updates = {};
    updates['/topics/' + newPostKey] = postData;

    return database.ref().update(updates);
  }

  $scope.addTopic = function addTopic($scope){

    // Send Topic to database
    writeNewTopic($scope.newTopic, $scope.anger, $scope.disgust, $scope.fear, $scope.joy, $scope.sadness);

    // Clear form input 
    $scope.newTopic = '';
    $scope.anger = '';
    $scope.disgust = '';
    $scope.fear = '';
    $scope.joy = '';
    $scope.sadness = '';

    return;
  };

  $scope.removeTopic = function removeTopic($scope, key){

    var updates = {};
    updates['/topics/' + key] = null;

    return database.ref().update(updates);
  };


  // Watch the firebase database
  firebase.database().ref('topics/').on('value', function(snapshot){
    $scope.topics = snapshot.val();
    
    $scope.topics = [];
    snapshot.forEach(function(childSnapshot) {
      $scope.topics.push(childSnapshot.val());
    });
    // console.log($scope.topics.length);
    // for(i = 0; i < $scope.topics.length; i++){
    //   console.log($scope.topics[i].body);
    // }
    
  });
  
  //Plotly.newPlot('myDiv', data);

  angular.element(document).ready(function () {
    console.log("ready");
  });




  $scope.togglePlot = function(name, anger, disgust, fear, joy, sadness){

    if($("#"+name).is(":hidden")){
      $("#"+name).slideDown( "fast", function(){});
    } else {
      $("#"+name).slideUp("fast", function(){});
    }
    
    var data = [{
      x: ['Anger', 'Disgust', 'Fear', 'Joy', 'Sadness'],
      y: [anger, disgust, fear, joy, sadness],
      type: 'bar'
    }];

    var layout = {
      autosize: false,
      width: 450,
      height: 450
    };

    Plotly.newPlot(name, data, layout);

  };

});
