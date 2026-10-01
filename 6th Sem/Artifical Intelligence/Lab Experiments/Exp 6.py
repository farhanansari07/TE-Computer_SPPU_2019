def evaluate_employee():
    print("===== EXPERT SYSTEM: EMPLOYEE PERFORMANCE EVALUATION =====")

    name = input("Enter Employee Name: ")
    role = input("Enter Role/Department: ")

    print("\nRate the following (1 = Poor, 5 = Excellent):")

    teamwork = int(input("Teamwork: "))
    punctuality = int(input("Punctuality: "))
    task_completion = int(input("Task Completion: "))
    communication = int(input("Communication Skills: "))
    problem_solving = int(input("Problem Solving: "))
    leadership = int(input("Leadership (or enter 3 if not applicable): "))

    # Knowledge base (criteria)
    scores = {
        "Teamwork": teamwork,
        "Punctuality": punctuality,
        "Task Completion": task_completion,
        "Communication": communication,
        "Problem Solving": problem_solving,
        "Leadership": leadership
    }

    total = sum(scores.values())
    average = total / len(scores)

    # Inference Engine (decision rules)
    if average >= 4.5:
        performance = "Outstanding"
    elif average >= 3.5:
        performance = "Good"
    elif average >= 2.5:
        performance = "Average"
    else:
        performance = "Below Average"

    print("\n===== PERFORMANCE REPORT =====")
    print(f"Employee: {name}")
    print(f"Department: {role}")
    print(f"Average Score: {average:.2f}/5")
    print(f"Overall Performance: {performance}")

    # 🔥 Reasoning (WHY decision was made)
    print("\n--- Expert Analysis ---")

    strengths = []
    weaknesses = []

    for skill, score in scores.items():
        if score >= 4:
            strengths.append(skill)
        elif score <= 2:
            weaknesses.append(skill)

    if strengths:
        print("Strengths:", ", ".join(strengths))

    if weaknesses:
        print("Weak Areas:", ", ".join(weaknesses))

    # 🔥 Rule-based suggestions (Expert Advice)
    print("\n--- Recommendations ---")

    if performance == "Outstanding":
        print("• Consider for promotion or leadership roles")
    elif performance == "Good":
        print("• Performing well, minor improvements needed for excellence")
    elif performance == "Average":
        print("• Needs targeted training and monitoring")
    else:
        print("• Immediate improvement plan required")

    # Additional rule-based insights
    if punctuality <= 2:
        print("• Improve time management and attendance")
    if teamwork <= 2:
        print("• Work on collaboration and team interaction")
    if communication <= 2:
        print("• Enhance communication skills")
    if problem_solving <= 2:
        print("• Improve analytical and problem-solving ability")
    if leadership >= 4:
        print("• Strong leadership potential detected")

    print("\n=====================================")


# Menu loop (important for exam polish)
while True:
    evaluate_employee()
    again = input("\nEvaluate another employee? (y/n): ")
    if again.lower() != 'y':
        print("Exiting Expert System...")
        break