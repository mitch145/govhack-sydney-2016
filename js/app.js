var app = angular.module("MyTopicList", []);
app.controller("myCtrl", function($scope) {

  $scope.searchTopics = '';
  $scope.started = true;
  $scope.admin = false;
  $scope.test = "testing";

  $scope.start = function(scope){
    initPlots($scope);
    $scope.started = true;
  };


  initPlots = function($scope){
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
  


  function writeNewTopic(name, emotions) {
    console.log(emotions);

    // Get a key for a new Post.
    var newPostKey = database.ref().child('posts').push().key;

    // A post entry.
    var postData = {
      key: newPostKey,
      name: name,
      population: emotions.population,
      media: emotions.media,
      government: emotions.government
    };
    console.log(postData);

    // Write the new post's data
    var updates = {};
    updates['/topics/' + newPostKey] = postData;

    return database.ref().update(updates);
  }

  $scope.addTopic = function addTopic($scope){

    // Send Topic to database
    writeNewTopic($scope.newTopic, $scope.emotions);

    // Clear form input 
    $scope.newTopic = '';
    $scope.emotions = '';

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




  $scope.togglePlot = function(name, population, media, government){
    console.log("population");
    console.log(population);
    console.log("media");
    console.log(media);
    console.log("government");
    console.log(government);
    
    var trace1 = {
      x: [0, 1, 2, 3, 4],
      y: [population.anger, population.disgust, population.fear, population.joy, population.sadness],
      name: 'Public',
      type: 'bar'
    };

    var trace2 = {
      x: [0, 1, 2, 3, 4],
      y: [media.anger, media.disgust, media.fear, media.joy, media.sadness],
      name: 'Media',
      type: 'bar'
    };

    var trace3 = {
      x: [0, 1, 2, 3, 4],
      y: [government.anger, government.disgust, government.fear, government.joy, government.sadness],
      name: 'Government',
      type: 'bar'
    };

    var data = [trace1, trace2, trace3];

    var layout = {
      barmode: 'stack',            
    };



        
    Plotly.newPlot(name, data, layout);

    if($("#"+name).is(":hidden")){
      $("#"+name).slideDown( "fast", function(){});
    } else {
      $("#"+name).slideUp("fast", function(){});
    }

  };

});
