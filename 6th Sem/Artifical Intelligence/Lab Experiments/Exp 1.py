from collections import deque

# Take number of vertices
v = int(input("Enter number of vertices: "))

# Create empty graph using normal for loop
graph = {}
for i in range(v):
    graph[i] = []

# Take number of edges
e = int(input("Enter number of edges: "))

# Add edges
for i in range(e):
    u, w = map(int, input("Enter edge (u v): ").split())
    graph[u].append(w)
    graph[w].append(u)

# DFS (Recursive)
def dfs(node, visited):
    visited.add(node)
    print(node, end=" ")

    for neigh in graph[node]:
        if neigh not in visited:
            dfs(neigh, visited)

# BFS (Using Queue)
def bfs(start):
    visited = set()
    q = deque()

    visited.add(start)
    q.append(start)

    while len(q) > 0:
        node = q.popleft()
        print(node, end=" ")

        for neigh in graph[node]:
            if neigh not in visited:
                visited.add(neigh)
                q.append(neigh)

# Run the program
start = int(input("Enter starting node: "))

print("\nDFS (Depth-wise State Space Exploration):")
dfs(start, set())

print("\nBFS (Level-wise State Space Exploration):")
bfs(start)


# Sample Input
# Enter number of vertices: 6
# Enter number of edges: 5
# Enter edge (u v): 0 1
# Enter edge (u v): 0 2
# Enter edge (u v): 1 3
# Enter edge (u v): 1 4
# Enter edge (u v): 2 5
# Enter starting node: 0

# Graph Formed
#         0
#       /   \
#      1     2
#     / \     \
#    3   4     5

# Output
# DFS (Depth-wise State Space Exploration):
# 0 1 3 4 2 5 

# BFS (Level-wise State Space Exploration):
# 0 1 2 3 4 5