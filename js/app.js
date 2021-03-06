    var app = angular.module('app', ['ngRoute']);

	app.config(function($routeProvider) {
		$routeProvider

			.when('/', {
				templateUrl : 'template/home.html',
				controller  : 'mainController'
			})

			.when('/about', {
				templateUrl : 'template/about.html',
				controller  : 'aboutController'
			})
        
			.when('/contact', {
				templateUrl : 'template/contact.html',
				controller  : 'contactController'
			})
      
			.when('/cart', {
				templateUrl : 'template/cart.html',
				controller  : 'cartController'
			})
        
			.when('/product', {
				templateUrl : 'template/product.html',
				controller  : 'productController'
			})
      
			.when('/shopping', {
				templateUrl : 'template/shopping.html',
				controller  : 'shoppingController'
			});
	});

	app.controller('mainController', function($scope, $rootScope, $http) {
      $rootScope.cart = [];
      $scope.prod = [];
      $scope.currentSlide = 2;
      $scope.toggle = false;
      $scope.maxSlide = 4;
      
      $http.get('https://webmppcapstone.blob.core.windows.net/data/itemsdata.json')
        .then(function(response) {
          $rootScope.data = response.data; 
        
          let count = 0;
          while (count < 10) {
            let dataRan = $rootScope.data[Math.floor(Math.random()*$rootScope.data.length)];
            let subRan = dataRan.subcategories[Math.floor(Math.random()*dataRan.subcategories.length)];
            let itemRan = subRan.items[Math.floor(Math.random()*subRan.items.length)];
            
            if ((itemRan !== undefined) && (!$scope.prod.includes(itemRan))) {
              console.log(itemRan);
              $scope.prod.push(itemRan);
              count++;
            }  
 
          }
        });
      
      $scope.ChangeSlide = function(isRight) {
        if (isRight) {
          $('#slide' + $scope.currentSlide).transition('fade right');
          if ($scope.currentSlide >= $scope.maxSlide) {
            $scope.currentSlide = 1;
          }
          else {
            $scope.currentSlide++;
          }
          $('#slide' + $scope.currentSlide).transition('fade right');
        }
        else {
          $('#slide' + $scope.currentSlide).transition('fade left');
          if ($scope.currentSlide <= 1) {
            $scope.currentSlide = $scope.maxSlide;
          }
          else {
            $scope.currentSlide--;
          }
          $('#slide' + $scope.currentSlide).transition('fade left');
        }
      }
      
      $scope.AutoSlide = function() {
        console.log("hi");
        if ($scope.toggle) {
          $scope.auto = setInterval(function(){ 
            $('#slide' + $scope.currentSlide).transition('fade right');
            if ($scope.currentSlide >= $scope.maxSlide) {
              $scope.currentSlide = 1;
            }
            else {
              $scope.currentSlide++;
            }
            $('#slide' + $scope.currentSlide).transition('fade right');
          }, 3000);
        }
        else {
          clearInterval($scope.auto);
        }
      }
	});

	app.controller('aboutController', function($scope, $rootScope) {

	});

	app.controller('contactController', function($scope, $rootScope) {

      $scope.RunJ = function() {
        $('.ui.dropdown').dropdown();
        $('.ui.form')
          .form({
            fields: {
              name: {
                identifier: 'name',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'Please enter your name'
                  }
                ]
              },
              email: {
                identifier: 'email',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'Please enter your Email'
                  }
                ]
              },
              subject: {
                identifier: 'subject',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'Please select a subject'
                  }
                ]
              },
              message: {
                identifier: 'message',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'Please enter your message'
                  }
                ]
              }
            }
          });
      }
      
	});

	app.controller('cartController', function($scope, $rootScope) {
      $scope.qty = [];
      
      $scope.getTotal = function() {
        let sub = 0;
        if ($rootScope.cart) {
          for (i = 0; i < $rootScope.cart.length; i++) {
            sub += $rootScope.cart[i].price * $rootScope.cart[i].qty;
          } 
        }
        return sub.toFixed(2);
      }
      
      $scope.Remove = function(index) {
        $rootScope.cart.splice(index, 1);
      }
      
      $scope.RunJ = function() {
        $('.ui.form')
          .form({
            fields: {
              name: {
                identifier: 'name',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'Please enter your name'
                  }
                ]
              },
              address: {
                identifier: 'address',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'Please enter your address'
                  }
                ]
              },
              city: {
                identifier: 'city',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'Please enter your city'
                  }
                ]
              },
              phone: {
                identifier: 'phone',
                rules: [
                  {
                    type   : 'regExp',
                    value: /^\d{6,20}$/,
                    prompt : 'Please enter a valid phone number (6 - 20 numbers)'
                  }
                ]
              }
            }
          });
      }
      
	});

	app.controller('productController', function($scope, $rootScope, $location) {
      console.log($location.search().name);
      
      $scope.currProduct;
      $scope.qty;
      
      $scope.GetProduct = function() {
        for (i in $rootScope.data) {
          for (j in $rootScope.data[i].subcategories) {
            for (k in $rootScope.data[i].subcategories[j].items) {
              if ($location.search().name == $rootScope.data[i].subcategories[j].items[k].name) {
                $scope.currProduct = $rootScope.data[i].subcategories[j].items[k];
                console.log($rootScope.data[i].subcategories[j].items[k]);
                return;
              }
            }
          }
        }
      }
      
      $scope.Add = function() {
        $scope.currProduct.qty = $scope.qty;
        console.log($scope.currProduct);
        $rootScope.cart.push($scope.currProduct);
      }
      
	})

	app.controller('shoppingController', function($scope, $rootScope, $route) {

      $scope.cardlist = [];
      $scope.cardname;
      $scope.cardlength;
      $scope.stockCheck = false;
      
      let firstdata = $rootScope.data[0].subcategories[0];
      $scope.cardname = firstdata.name;
      $scope.cardlist = firstdata.items;
      $scope.cardlength = firstdata.items.length;
      
      $scope.RunJ = function() {
          $('.ui.accordion').accordion('refresh');
          $('.ui.dropdown').dropdown();
      }
      
      $scope.selectItem = function(item) {
        $scope.cardlist = item.items;
        $scope.cardname = item.name;
        $scope.cardlength = item.items.length;
      }
      
      $scope.FilterFunction = function(item) {
        if (item.stock > 0 || !$scope.stockCheck) {
          return true;
        }
        return false;
      }
      
      $scope.Sort = function(p) {
        console.log($scope.cardlist);
        if (p == 'Price') {
          $scope.cardlist.sort(function(a, b) {
              return a.price > b.price;
          });
        }
        if (p == 'Alphabetical') {
          $scope.cardlist.sort(function(a, b) {
              return a.name > b.name;
          });
        }
        if (p == 'Rating') {
          $scope.cardlist.sort(function(a, b) {
              return a.rating < b.rating;
          });
        }
      }
      
      $scope.AddCart = function(item) {
        if (!$rootScope.cart.includes(item)){
          item.qty = 1;
          $rootScope.cart.push(item);
        }
        console.log($rootScope.cart);
      }
      
      $scope.Go = function (path) {
        $location.path(path);
      };
      

	});