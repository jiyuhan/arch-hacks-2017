import math

# magnitude of 3d vector
def magnitude( x, y, z):
    return math.sqrt(x**2+y**2+z**2)

#"instantaneous" acceleration
def rotational_acceleration(rotation_i, rotation_f):
    time = 0.01
    return  (rotation_f-rotation_i)/time

#CP at a specific point
def concussion_probability(max_linear, max_rotation):
    b0 = -10.2
    b1 = 0.04332
    b2 = 0.000873
    b3 = -0.00000092
    return 1 / (1 + math.exp(-(b0+b1*max_linear+b2*max_rotation+b3*max_linear*max_rotation)))




