<?php
    require "aps/2/runtime.php";     
    /**
    * @type("http://myweatherdemo.com/company/1.1")
    * @implements("http://aps-standard.org/types/core/resource/1.0")
    */    
    class company extends \APS\ResourceBase    
    {
        /**
        * @link("http://myweatherdemo.com/application/1.0")
        * @required
        */
        public $application;
        
        /**
         * @link("http://myweatherdemo.com/user/1.0[]")
         */
        public $users;    
        
        /**
        * @link("http://myweatherdemo.com/city/1.0[]")
        */
        public $cities;
        
        /**
        * @link("http://aps-standard.org/types/core/account/1.0")
        * @required
        */
        public $account;
        
        /**
        * @type("http://aps-standard.org/types/core/resource/1.0#Counter")
        * @unit("unit")
        * @title("Number of queries in MyWeatherDemo UI")
        */
        public $query_counter;

                /**
         * @type(string)
         * @title("Company identifier in MyWeatherDemo")
         */
		public $company_id;
		
        /**
         * @type(string)
         * @title("Login to MyWeatherDemo interface")
         */
		public $username;
		
        /**
         * @type(string)
         * @title("Password for MyWeatherDemo user")
         */
        public $password;

        /**
         * @type(string)
         * @title("Notification ID")
         */
        public $notificationId;


		public function provision(){
            
            // to create a company in external service we need to pass country, city and name of the company
            // we can get them from linked core/account resource
            $request = array(
                    'country' => $this->account->addressPostal->countryName,
                    'city' => $this->account->addressPostal->locality,
                    'name' => $this->account->companyName
            );
            
            $url = $this->application->url . "company/";
            $response = $this->send_curl_request('POST', $url, $request);
            // need to save company_id in APSC, going to use that later to delete a resource in unprovision()
            // username and password will be used to login to MyWeatherDemo web interface
            $this->company_id = $response->{'id'};
            $this->username = $response->{'username'};
            $this->password = $response->{'password'};
        }
		
        // unprovision() method is executed when resource is removed (DELETE)
        public function unprovision(){
            // need to pass company_id to indicate which company we want to delete
            $url = $this->application->url . "company/" . $this->company_id;
            $response = $this->send_curl_request('DELETE', $url);
        }

        public function configure($new){
            // need to pass company_id to indicate which company we want to delete
            $url = $this->application->url . "company/" . $this->company_id;
            // $new contains new values that will be saved in APS controller after configure() exits
            // you can access old values using $this
            $request = array(
                'username' => $new->username,
                'password' => $new->password
            );
            $response = $this->send_curl_request('PUT', $url, $request);

            // Get instance of the Notification Manager:
            $notificationManager = \APS\NotificationManager::getInstance();
            // Create Notification structure
            $notification = new \APS\Notification;
            $notification->message = new \APS\NotificationMessage("Company update");
            $notification->details = new \APS\NotificationMessage("Company details were updated");
            $notification->status = \APS\Notification::ACTIVITY_READY;
            $notification->packageId = $this->aps->package->id;
            
            $notificationResponse = $notificationManager->sendNotification($notification);
            // Store the Notification ID to update or remove it in other operations
            $this->notificationId = $notificationResponse->id;

          }

        /**
         * @verb(GET)
         * @path("/getTemperature")
         */
        public function getTemperature(){
            // to get current temperature we need to send GET request providing company_id
            $url = $this->application->url . "company/" . $this->company_id;
            $response = $this->send_curl_request('GET', $url);
            // returning temperature, city, country to the caller, in our case - company.js
            $temperature = array();
            $temperature['fahrenheit'] = $response->{'fahrenheit'};
            $temperature['celsius'] = $response->{'celsius'};
            $temperature['city'] = $response->{'city'};
            $temperature['country'] = $response->{'country'};
        
            // APS PHP runtime will automatically execute json_encode for $temperature
            return $temperature; 
            
        }

        public function retrieve(){
            $url = $this->application->url . "company/" . $this->company_id;
			$response = $this->send_curl_request('GET', $url);
			$this->query_counter->usage = $response->{'weatherCount'};
		}

		// you can add your own methods as well, don't forget to make them private
		private function send_curl_request($verb, $url, $payload = ''){
			$token = $this->application->token;
			$headers = array(
					'Content-type: application/json',
					'x-provider-token: '. $token
			);
			$ch = curl_init();
			
			curl_setopt_array($ch, array(
			CURLOPT_URL            => $url,
			CURLOPT_RETURNTRANSFER => 1,
			CURLOPT_CUSTOMREQUEST => $verb,
			CURLOPT_HTTPHEADER => $headers,
			CURLOPT_POSTFIELDS => json_encode($payload)
			));
			
			$response = json_decode(curl_exec($ch));
			
			curl_close($ch);
			return $response;
		}

    }
?>