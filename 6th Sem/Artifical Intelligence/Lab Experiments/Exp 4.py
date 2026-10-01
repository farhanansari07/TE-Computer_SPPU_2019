def is_safe(board, row, col, n):
    # Check same column
    for i in range(row):
        if board[i][col] == 1:
            return False

    # Check left diagonal
    i, j = row - 1, col - 1
    while i >= 0 and j >= 0:
        if board[i][j] == 1:
            return False
        i -= 1
        j -= 1

    # Check right diagonal
    i, j = row - 1, col + 1
    while i >= 0 and j < n:
        if board[i][j] == 1:
            return False
        i -= 1
        j += 1

    return True

def solve_nqueens(board, row, n):
    # Base case: all queens placed
    if row == n:
        return True

    for col in range(n):
        if is_safe(board, row, col, n):
            board[row][col] = 1  # Place queen

            if solve_nqueens(board, row + 1, n):
                return True

            board[row][col] = 0  # Backtrack

    return False

def print_board(board, n):
    for i in range(n):
        for j in range(n):
            print("Q" if board[i][j] == 1 else ".", end=" ")
        print()


# MAIN
n = int(input("Enter number of queens: "))
board = [[0]*n for _ in range(n)]

if solve_nqueens(board, 0, n):
    print("\nSolution:")
    print_board(board, n)
else:
    print("No solution exists")



# Sample Input
# Enter number of queens: 4

# Output
# Solution:
# . Q . .
# . . . Q
# Q . . .
# . . Q .