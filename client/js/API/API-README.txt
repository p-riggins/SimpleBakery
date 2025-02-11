Main Usage Notes
    POSTs must be called by using (url)/api/post/...
    PUTs must be called by using (url)/api/put/...
    DELETEs must be called by using (url)/api/delete/...
    We are handling EVERYTHING with POST calls so that means EVERYTHING requires a POST with json formating. Reference the endpoint calls below to see what I mean.


API-Post.js Endpoints Usage
    Emails
        Get all Emails
            curl -X POST <url>/api/post/emails/all

        Get one Email by ID
            curl -X POST <url>/api/post/emails/by-id -H "Content-Type: application/json" -d "{\"EmailID\": \"<ID of Email you are retrieving>\"}"

        Create a new Email for an existing user
            curl -X POST <url>/api/post/emails/create_additional -H "Content-Type: application/json" -d "{\"EmailAddress\": \"<New Email Address>\", \"UserID\": \"<Include the user's uuid here>\", \"Type\": \"<Input email type here (Personal or Work)>\"}"

    Employees
        Get all Employees
            curl -X POST <url>/api/post/employees/all

    Ingredients
        Get all Ingredients
            curl -X POST <url>/api/post/ingredients/all

        Create a new Ingredient


    Inventory
        Get all items in Inventory
            curl -X POST <url>/api/post/inventory/all

        Get an item in Inventroy by ID
            curl -X POST <url>/api/post/inventory/by-id -H "Content-Type: application/json" -d "{\"EntryID\": \"<ID of item you are searching for>\"}"

        Create an Inventory Item
            curl -X POST <url>/api/post/inventory/new-item -H "Content-Type: application/json" -d "{\"Quantity\": \"<int>\", \"UserID\": \"<ID of the user adding the item to the inventory>\", \"Notes\": \"<VarChar>\", \"Cost\": \"<Float>\", \"ExpireDateTime\": \"<Expire date formatted YYYY-MM-DD HH-MM-SS>\", \"RecipeID\": \"<ID of the recipe this item is used in>\"}"

    PhoneNumbers
        Get all PhoneNumbers
            curl -X POST <url>/api/post/phone_numbers/all

    RecipeIngredients
        Get all Recipe Ingredients
            curl -X POST <url>/api/post/recipe_ingredients/all

    Recipes
        Get all Recipes
            curl -X POST <url>/api/post/recipes/all

    Sessions
        Nothing to add currently

    Users
        Get all Users
            curl -X POST <url>/api/post/users/all

    Vendors
        Get all Vendors
            curl -X POST <url>/api/post/vendors/all



API-Put.js Endpoints Usage
    Emails
        Update an Email via EmailID
            curl -X POST <url>/api/put/emails/update -H "Content-Type: application/json" -d "{\"EmailAddress\": \"<Updated Email Address here>\", \"UserID\": \"<ID of the User updating their Email Address>\", \"Type\": \"<Input email type here (Personal or Work)>\", \"EmailID\": \"<ID of the specific Email Address being updated>\"}"
            Note that Emails that are not marked as valid will be deleted from the database when updated

    EmailTypes

    Employees

    Ingredients

    Inventory

    PhoneNumbers

    PhoneTypes

    RecipeIngredients

    Recipes

    Sessions

    Users

    Vendors



API-Delete.js Endpoints Usage
    Emails
        Delete an Email by EmailID
            curl -X POST <url>/api/delete/emails/delete -H "Content-Type: application/json" -d "{\"EmailID\": \"<Email Address ID that is being deleted>\"}"

    EmailTypes

    Employees

    Ingredients

    Inventory

    PhoneNumbers

    PhoneTypes

    RecipeIngredients

    Recipes

    Sessions

    Users

    Vendors