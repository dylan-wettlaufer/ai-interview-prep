import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

try:
    # Try to get one row from interview table to see columns
    response = supabase.table("interview").select("*").limit(1).execute()
    if response.data:
        print("Columns in 'interview' table:", response.data[0].keys())
    else:
        print("No data in 'interview' table. Trying to get table info from RPC if possible, or just trying a dummy insert.")
        # Alternatively, try a dummy insert with minimal fields and see what it says
        try:
            # We don't want to actually insert if we don't have to, but we can try to insert an empty object
            # and catch the error to see required columns.
            supabase.table("interview").insert({}).execute()
        except Exception as e:
            print("Error on empty insert:", str(e))
except Exception as e:
    print("Error querying table:", str(e))
