import random
class QLearningAgent:
    def __init__(self, actions, learning_rate=0.1, discount_factor=0.95, epsilon=0.1):
        self.q_table = {}  # Initialize Q-table as a dictionary
        self.actions = actions  # Actions could be [increase_Kp, decrease_Kp, increase_Ti, decrease_Ti, etc.]
        self.alpha = learning_rate  # Learning rate
        self.gamma = discount_factor  # Discount factor
        self.epsilon = epsilon  # Exploration rate

    def get_q_value(self, state, action):
        return self.q_table.get((state, action), 0.0)

    def choose_action(self, state):
        if random.uniform(0, 1) < self.epsilon:
            return random.choice(self.actions)  # Explore: random action
        else:
            # Exploit: choose the action with the highest Q-value
            q_values = [self.get_q_value(state, action) for action in self.actions]
            max_q_value = max(q_values)
            return self.actions[q_values.index(max_q_value)]

    def learn(self, state, action, reward, next_state):
        # Q-learning formula: Q(s, a) = Q(s, a) + alpha * (reward + gamma * max(Q(s', a')) - Q(s, a))
        next_q_values = [self.get_q_value(next_state, a) for a in self.actions]
        max_next_q = max(next_q_values)
        current_q = self.get_q_value(state, action)
        
        new_q = current_q + self.alpha * (reward + self.gamma * max_next_q - current_q)
        self.q_table[(state, action)] = new_q
