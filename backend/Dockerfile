FROM python:3.9-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy app and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Run the app
CMD ["python", "app.py"]
