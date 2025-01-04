import time
import random

# PID Controller class
class PIDController:
    def __init__(self, kp, ki, kd):
        self.Kp = max(kp,0)
        self.Ki = max(ki,0)
        self.Kd = max(kd,0)
        self.prev_error = 0
        self.integral = 0
        self.previous_sp = 0

    def compute(self, pv, dt, setpoint):
        error = setpoint - pv
        if self.previous_sp != setpoint:
            self.integral = 0
            self.prev_error = 0
        self.integral += error * dt
        derivative = (error - self.prev_error) / dt
        output = self.Kp * error + self.Ki * self.integral + self.Kd * derivative
        self.prev_error = error
        self.previous_sp = setpoint
        return max(0, min(100, output))  # Clamp MV to 0-100%



