#  Defining intro sequence as a function

def intro():
    print("|  |  |  |  |  |  |  |  |  |  |  |  |")
    print(" |  |  |  |  |  |  |  |  |  |  |  |  ")
    print("|  |  |  |  o--|  |  |  |  |  |  |  |")
    print(" |  |  |  |   \\ |  |  |  |  |  |  | ")
    print("|  |  |  |  | ||\\|  |  |  |  |  |  |")
    print("  |  |  |  |  || \\ |  |  |  |  |  | ")
    print("|  |  |  |  | ||  |  |  |  |  |  |  |")
    print("_____________====____________________")
    print("_____________________________________")
    print("You are a stand-up comedian. Before you, a crowd and a microphone.")
    print("Tell jokes to the crowd.")
    print("Type 'leave' anytime to get off the stage.\n")

#  Defining heckler as a function.

def heckler():
    print("\nA heckler shouts: 'Boooo, same joke again!'")
    choice = input("\nDo you want to 'confront' or 'ignore' the heckler? ")
    if choice == "confront":
        print("\nYou confront the heckler, the crowd cheers!")
    else:
        print("\nYou ignore the heckler and continue on with your set.")

#  Defining the variable which will have conditionals applied

last_joke = ""

#  Start of the game

intro() 

while True:
    print("\nYou are on stage, the crowd awaits.")
    action = input("Do you want to tell a 'joke' or 'leave'? ")

    if action == "leave":
        print("\nYou leave the stage.")
        break
    
    kind = input("Pick a joke: crowd / knock-knock / dad: ")

    if kind == last_joke:
        heckler()
    else:
        if kind == "crowd":
            print("\nYou riff with the crowd. Hahaha!")
        elif kind == "knock-knock":
            print("\nWho's there? The audience echos back...")
        elif kind == "dad":
            print("\nYou tell a dad joke. Some groan, some chuckle.") 
        else:
            print("\nThat's not a joke!")
    
    last_joke = kind