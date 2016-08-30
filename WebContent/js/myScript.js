/**
 * 
 */

var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider){
	$routeProvider.when("/",{
		 templateUrl :"home.html",
		 controller : "main"
	});
	$routeProvider.when("/add",{
		 templateUrl :"addEmployee.html",
		 controller : "add-ctrl"
	});
});


app.service('request', function($http,$q) {
	this.data="";
	this.user="";
	this.flag=true;
	
	this.getData = function() {
        var defer = $q.defer();
 
        $http.get("json/employe.json") // making http get request to load the json file
            .then(function(response) {
                defer.resolve(response.data);
            });
 
        return defer.promise;
    };
 
});
app.controller("main",function($scope,request,$location){
	$scope.data;
	if(request.data == ""){
	request.getData().then(function(response){;	
	
		request.data=response;
	
		//request.data=response;
		$scope.data=request.data;
		console.log(request.data);
		
	})
	}
	else if(request.data != ""){
		$scope.data=request.data;
		console.log($scope.data+" in controller");		
	}
	
		
	$scope.addEmployee = function(){
		request.flag=true;
		$location.path("/add");
	};
	
	$scope.editEmployee = function(user){
		
		request.user = user;
		request.flag = false;
		$location.path("/add");
	}
	
	$scope.removeEmployee = function(index){
		request.data.splice(index,1);
		$scope.data=request.data;
	}
});

app.controller("add-ctrl",function(request,$scope,$location,$filter){
	var index;
	var id;
	/* var dob,now,birthdate,born,age , employee,bdate;*/
	console.log(request.data[0].id);
	$scope.obj=request.data
	console.log($scope.obj[0].id+ 'objs');

    function get_age(born, now) {
      var birthday = new Date(now.getFullYear(), born.getMonth(), born.getDate());
      if (now >= birthday) 
        return now.getFullYear() - born.getFullYear();
      else
        return now.getFullYear() - born.getFullYear() - 1;
    }
	
	$scope.getDate = function() {
		return $filter('date')($scope.birthdate, 'MM/dd/yyyy');
		}
	console.log($scope.getDate() + 'birthdate');
	
	 if (request.flag == false){
	    	console.log("in request "+request.flag + " "+  request.user);
	    
	    	var employee = request.user;
	    var	temp=employee.birthDate.split("/");
	     var bdate = new Date(temp[2],temp[0]-1,temp[1]);
	    	
	    	
	    	 $scope.id=employee.id;
	    	$scope.fname = employee.firstName;
	    	$scope.mname = employee.middleName;
	    	$scope.lname = employee.lastName;
	    	$scope.birthdate = bdate;
	    }
	
	$scope.saveEmployee = function(){
		
		 if (request.flag == false){
			 id =$scope.id 
			 var 	dob = $scope.getDate();
			 var now = new Date();
			 var	birthdate = dob.split("/");
			 var born = new Date(birthdate[2], birthdate[0]-1, birthdate[1]);
			 var	age=get_age(born,now);
			 var	employee ={
					id: id,
					firstName:$scope.fname,
					middleName:$scope.mname,
					lastName:$scope.lname,
					birthDate:$scope.getDate(),
					age:age	
			 }
			 console.log("in request "+request.flag +" "+  request.user);
			 
			 for(i=0;i<request.data.length;i++){
				 if(parseInt(request.data[i].id) == id){			 
					 request.data[i] = angular.copy(employee);
					 console.log(request.data[i].firstName +"abcd");
					
				 }
			 }
			 
		 }
		 else{
			var x=($scope.obj.length) - 1;
		 	index = 1 + parseInt($scope.obj[x].id) ;
		
		 	console.log(index + 'id');
		 	var	dob = $scope.getDate();
		 	var	now = new Date();
		 	var	birthdate = dob.split("/");
		 	var	born = new Date(birthdate[2], birthdate[1]-1, birthdate[0]);
		 	var	age=get_age(born,now);
	     
	        console.log(birthdate[2]+" : "+birthdate[1]+" : "+birthdate[0]);
	        console.log(age);

		
	    $scope.$watch('data', function() {
	    	request.data.push(
	    			{id:index,
					firstName:$scope.fname,
					middleName:$scope.mname,
					lastName:$scope.lname,
					birthDate:$scope.getDate(),
					age:age	
	    			});

	    });
	    console.log("in req "+request.flag + " "+  request.index);
		 }
		console.log(request.data[0].id + "in addctrl");
		$location.path("/");
		
	};
	
	$scope.backHome = function(){
		$location.path("/");
	};
});