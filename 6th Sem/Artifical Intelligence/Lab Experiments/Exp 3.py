def dijkstra(graph, start):
    n = len(graph)
    visited = [False] * n
    dist = [float('inf')] * n

    dist[start] = 0

    for _ in range(n):
        min_dist = float('inf')
        u = -1
        for i in range(n):
            if not visited[i] and dist[i] < min_dist:
                min_dist = dist[i]
                u = i
        visited[u] = True

        for v in range(n):
            if graph[u][v] != 0 and not visited[v]:
                if dist[u] + graph[u][v] < dist[v]:
                    dist[v] = dist[u] + graph[u][v]

    print("\nShortest distances:")
    for i in range(n):
        print(f"{start} -> {i} = {dist[i]}")


# Taking input
n = int(input("Enter number of vertices: "))

print("Enter adjacency matrix:")
graph = []
for i in range(n):
    row = list(map(int, input().split()))
    graph.append(row)

start = int(input("Enter source vertex: "))

dijkstra(graph, start)


# Sample Input
# Sample Input:
# Enter number of vertices: 5
# Enter adjacency matrix:
# 0 10 0 30 100
# 10 0 50 0 0
# 0 50 0 20 10
# 30 0 20 0 60
# 100 0 10 60 0
# Enter source vertex: 0

# Expected Output
# Expected Output:

# Shortest distances:
# 0 -> 0 = 0
# 0 -> 1 = 10
# 0 -> 2 = 50
# 0 -> 3 = 30
# 0 -> 4 = 60

# Graph Diagram
# Graph Diagram:

#         (1)
#        /   \
#     10      50
#      /        \
#    (0)---30---(3)
#      \         / \
#        100   20   60
#          \   /     \
#      (4)---------(2)
#             10

# Edges:
# 0 - 1 = 10
# 0 - 3 = 30
# 0 - 4 = 100
# 1 - 2 = 50
# 2 - 3 = 20
# 2 - 4 = 10
# 3 - 4 = 60