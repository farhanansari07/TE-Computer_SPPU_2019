def chatbot():
    print("🤖 ChatBot: Hello! Welcome to our store. How can I help you?")
    print("You can ask about: products, order, return, or say 'bye' to exit.\n")

    while True:
        user_input = input("You: ").lower()

        # Greeting
        if user_input in ["hi", "hello", "hey"]:
            print("🤖 ChatBot: Hello! How can I assist you today?")

        # Product Inquiry
        elif "product" in user_input:
            print("🤖 ChatBot: We sell laptops, phones, and headphones.")

        # Order Status
        elif "order" in user_input:
            order_id = input("🤖 ChatBot: Please enter your Order ID: ")
            print(f"🤖 ChatBot: Order {order_id} is being processed and will arrive soon.")

        # Return Policy
        elif "return" in user_input:
            print("🤖 ChatBot: You can return any product within 7 days of delivery.")

        # Exit Condition
        elif user_input in ["bye", "exit"]:
            print("🤖 ChatBot: Thank you! Have a great day 😊")
            break

        # Default Response
        else:
            print("🤖 ChatBot: Sorry, I didn't understand that. Please try again.")

# Run chatbot
chatbot()


# You: hi
# Bot: Hello! How can I assist you today?

# You: what products do you have?
# Bot: We sell laptops, phones, and headphones.

# You: order
# Bot: Please enter your Order ID: 123
# Bot: Order 123 is being processed and will arrive soon.

# You: bye
# Bot: Thank you! Have a great day 😊