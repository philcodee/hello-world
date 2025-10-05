# Assignment #3

# Create your own story algorithm.

# You can modify an example from class (story maker) or create your own.

# Remember to comment your code and use examples of: - user inputs - variables (int or float, string, boolean) - concatenation


# Welcome message and instructions.

print("Welcome to PoemGen.")
print("Let's write something poem-y.")
print("-•-•-•-•-•-•-•>>>>>>")

# Poem Variables

emotional_state = input("How do you feel?: ")
random_word1 = input("Enter a random word: ")
random_word2 = input("Enter another random word: ")
natural_material = input("Choose one (Metal, wood, rock): ")


# A short poem which pairs the user's emotional state with a random word.
# The user then chooses another random word to pair with a natural material.

poem = "Feeling " + emotional_state + " and " + random_word1 + "."
"The " + random_word2 + " is made out of " + natural_material + "."

# Printing poem
print(poem)