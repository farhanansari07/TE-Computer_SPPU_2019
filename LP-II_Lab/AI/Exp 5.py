# Local storage for orders
orders = {
    "101": "Processing",
    "102": "Shipped",
    "103": "Delivered",
    "104": "Cancelled"
}

# Product database
products = {
    "laptop": 55000,
    "phone": 25000,
    "headphones": 3000
}


def chatbot():
    print("🤖 ChatBot: Welcome to TechStore!")
    print("Type 'help' to see available commands.\n")

    while True:
        user_input = input("You: ").lower()

        # Greeting
        if user_input in ["hi", "hello", "hey"]:
            print(" ChatBot: Hello! How can I assist you today?")

        # Help Menu
        elif user_input == "help":
            print("\n Available Options:")
            print("- products  → View products")
            print("- price     → Check product prices")
            print("- order     → Track your order")
            print("- return    → Return policy")
            print("- bye       → Exit chatbot\n")

        # Product Inquiry
        elif "product" in user_input:
            print("\n Available Products:")
            for item in products:
                print("-", item.capitalize())

        # Product Prices
        elif "price" in user_input:
            product_name = input("Enter product name: ").lower()

            if product_name in products:
                print(f" ChatBot: Price of {product_name} is ₹{products[product_name]}")
            else:
                print(" ChatBot: Product not found.")

        # Order Tracking
        elif "order" in user_input:
            order_id = input(" ChatBot: Enter your Order ID: ")

            if order_id in orders:
                print(f" ChatBot: Order {order_id} status → {orders[order_id]}")
            else:
                print(" ChatBot: Sorry, Order ID not found.")

        # Return Policy
        elif "return" in user_input:
            print(" ChatBot: Products can be returned within 7 days.")

        # Exit
        elif user_input in ["bye", "exit"]:
            print(" ChatBot: Thank you for visiting TechStore ")
            break

        # Default Response
        else:
            print(" ChatBot: Sorry, I didn't understand that.")


# Run chatbot
chatbot()



#  ChatBot: Welcome to TechStore!
# Type 'help' to see available commands.

# You: help

#  Available Options:
# - products
# - price
# - order
# - return
# - bye

# You: products

#  Available Products:
# - Laptop
# - Phone
# - Headphones

# You: price
# Enter product name: laptop
#  ChatBot: Price of laptop is ₹55000

# You: order
# Enter your Order ID: 103
#  ChatBot: Order 103 status → Delivered

# You: bye
#  ChatBot: Thank you for visiting TechStore 
