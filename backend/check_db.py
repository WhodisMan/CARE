import sqlite3

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

# Check available tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print("Tables:", tables)

# Check data inside predictions table (if exists)
if ("predictions",) in tables:
    cursor.execute("SELECT * FROM predictions;")
    print("Predictions Data:", cursor.fetchall())

# Check data inside gradcam_results table (if exists)
if ("gradcam_results",) in tables:
    cursor.execute("SELECT * FROM gradcam_results;")
    print("GradCAM Results Data:", cursor.fetchall())

conn.close()

# to check the running of database