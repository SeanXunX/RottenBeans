import requests
import json
from bs4 import BeautifulSoup
import time
import re
import uuid

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0",
    "Cookie": 'll="118163"; bid=w9Zez3xgYZc; _pk_id.100001.3ac3=9d187c89667a711f.1737100508.; _vwo_uuid_v2=D936FF82A4B67918281DB700F4184A836|164c8607e1e4a3dcf770441b726798ba; douban-fav-remind=1; __utmz=30149280.1745054247.8.5.utmcsr=bing|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); viewed="36074027_37074765_30681475"; _ga=GA1.1.353083169.1737100499; _ga_RXNMP372GL=GS1.1.1745054419.1.1.1745054520.60.0.0; __utma=30149280.353083169.1737100499.1745054247.1745656215.9; __utmc=30149280; __utmt=1; dbcl2="220349485:WzVm2NPle4o"; ck=Hq24; push_doumail_num=0; __utmv=30149280.22034; frodotk_db="77d13eaa660415a36773bbff320c40e9"; __utmt_douban=1; __utma=81379588.568067213.1737100508.1745054254.1745656275.3; __utmc=81379588; __utmz=81379588.1745656275.3.3.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.3ac3=%5B%22%22%2C%22%22%2C1745656275%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_ses.100001.3ac3=1; push_noty_num=0; __utmb=30149280.5.10.1745656215; __utmb=81379588.2.10.1745656275',
}


def get_book_links(page_url):
    resp = requests.get(page_url, headers=headers)
    soup = BeautifulSoup(resp.text, "html.parser")
    links = [
        a["href"]
        for a in soup.select(".pl2 a")
        if a["href"].startswith("https://book.douban.com/subject/")
    ]
    return links


def parse_book_detail(book_url):
    data = {}
    resp = requests.get(book_url, headers=headers)
    soup = BeautifulSoup(resp.text, "html.parser")
    data["id"] = str(uuid.uuid4())
    book_title = soup.find("span", attrs={"property": "v:itemreviewed"}).text.strip()
    data["title"] = book_title
    info_text = soup.select_one("#info").get_text(separator="\n").strip()

    fields = ["作者", "出版社", "定价", "ISBN"]
    cols = ["author", "publisher", "retail_price", "isbn"]
    # data = {"url": book_url}
    for field, col in zip(fields, cols):
        match = re.search(rf"{field}\s*:\s*(.*)", info_text)
        t = match.group(1).strip() if match else None
        if t == None:
            continue
        data[col] = t
    return data


def crawl_douban_top250():
    all_books = []
    for start in range(0, 50, 25):
        page_url = f"https://book.douban.com/top250?start={start}"
        print(f"抓取页面: {page_url}")
        book_links = get_book_links(page_url)
        for link in book_links:
            print(f"抓取图书: {link}")
            book_data = parse_book_detail(link)
            if len(book_data) == 6:
                all_books.append(book_data)
            time.sleep(1)  # 延迟避免被封
        time.sleep(2)

    json_path = "./douban_book.json"
    with open(json_path, "w") as file:
        json.dump(all_books, file, ensure_ascii=False, indent=4)

    return all_books


if __name__ == "__main__":
    # data = parse_book_detail("https://book.douban.com/subject/24531956/")
    # print(data)
    crawl_douban_top250()
