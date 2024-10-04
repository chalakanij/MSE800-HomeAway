class User:
    def __init__(self, title, first_name, last_name, email, phone_number, username, password, role, user_id=None):
        self.title = title.capitalize()
        self.first_name = first_name.capitalize()
        self.last_name = last_name.capitalize()
        self.email = email
        self.phone_number = phone_number
        self.password = password.lower()
        self.role = role.lower()
        self.user_id = user_id

