from flask import Blueprint, request, jsonify, send_file
import csv
import os
import traceback
import requests
from bs4 import BeautifulSoup
import random

# Initialize the blueprint
bp = Blueprint("scrape", __name__)

# User agents list to mimic browser requests
user_agent = [
    "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; Acoo Browser 1.98.744; .NET CLR 3.5.30729)",
    "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; Acoo Browser 1.98.744; .NET CLR 3.5.30729)",
    "Mozilla/5.0 (compatible; MSIE 9.0; AOL 9.7; AOLBuild 4343.19; Windows NT 6.1; WOW64; Trident/5.0; FunWebProducts)",
]


def scrape_data(url):
    headers = {"User-Agent": random.choice(user_agent)}
    response = requests.get(url, headers=headers, timeout=30)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        listings = soup.find_all("div", class_="MuiCard-root")
        data = []
        for listing in listings:
            title = (
                listing.find("h3", class_="MuiTypography-root").get_text(strip=True)
                if listing.find("h3", class_="MuiTypography-root")
                else "N/A"
            )
            phone = (
                listing.find("a", {"class": "MuiButtonBase-root"})["href"].split(":")[
                    -1
                ]
                if listing.find("a", {"class": "MuiButtonBase-root"})
                else "N/A"
            )
            link = (
                listing.find(
                    "a",
                    {
                        "class": "MuiButtonBase-root MuiButton-root MuiButton-text ButtonWebsite MuiButton-textSecondary MuiButton-fullWidth"
                    },
                )["href"]
                if listing.find(
                    "a",
                    {
                        "class": "MuiButtonBase-root MuiButton-root MuiButton-text ButtonWebsite MuiButton-textSecondary MuiButton-fullWidth"
                    },
                )
                else "N/A"
            )
            address = (
                listing.find("p", class_="MuiTypography-root").get_text(strip=True)
                if listing.find("p", class_="MuiTypography-root")
                else "N/A"
            )
            data.append([title, address, phone, link])
        return data
    else:
        return []


@bp.route("/", methods=["GET"])
def scrape():
    keyword = request.args.get("keyword", "Construction")
    file_name = f"{keyword}_data.csv"
    is_first_page = True
    start_page = int(request.args.get("start", 1))  # Default start page is 1
    end_page = int(request.args.get("end", 1))  # Default end page is 30
    try:
        for pageNum in range(start_page, end_page + 1):  # Adjustable page range
            url = f"https://www.yellowpages.com.au/search/listings?clue={keyword}&locationClue=All+States&pageNumber={pageNum}"
            data = scrape_data(url)
            if data:
                if len(data) > 3:
                    data = data[:-3]
                    write_to_csv(file_name, data, is_first_page)
                    is_first_page = False
            else:
                print(f"No data found to write to CSV for page {pageNum}.")

        file_path = os.path.join(os.getcwd(), file_name)
        if os.path.exists(file_path):
            return send_file(file_path, as_attachment=True)
        else:
            return jsonify({"error": "File not found after creation attempt"}), 404

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


def write_to_csv(file_name, data, is_first_page):
    mode = "w" if is_first_page else "a"
    with open(file_name, mode=mode, newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        if is_first_page:
            writer.writerow(["Title", "Address", "Phone", "Website"])
        for item in data:
            if item[3] != "N/A":  # Skip rows where website is "N/A"
                writer.writerow(item)
