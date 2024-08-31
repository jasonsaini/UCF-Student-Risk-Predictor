import ollama
import sys

def query(query):
    stream  = ollama.chat(
        model='gemma2:latest',
        messages=[{'role': 'user', 'content': user_input}],
        stream=True,
    )
    answer = ""
    for chunk in stream:
        answer += str(chunk['message']['content'])
    return answer

def prompt(prompt, query):
    return query(f"{prompt} {query}")

if __name__ == "__main__":
    while True:
        print(">", end=" ")

        sys.stdout.flush()

        user_input = sys.stdin.readline().strip()
        
        if user_input:
            output = query(user_input)
            print(output)
