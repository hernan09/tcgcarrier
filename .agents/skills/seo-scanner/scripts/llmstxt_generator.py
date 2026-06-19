#!/usr/bin/env python3
"""
llms.txt Generator — Creates and validates llms.txt files for AI crawler guidance.
"""

import sys
import json
import re
from urllib.parse import urljoin, urlparse

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("ERROR: Required packages not installed. Run: pip install -r requirements.txt")
    sys.exit(1)

DEFAULT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
}


def validate_llmstxt(url: str) -> dict:
    """Check if llms.txt exists and validate its format."""
    parsed = urlparse(url)
    base_url = f"{parsed.scheme}://{parsed.netloc}"
    llms_url = f"{base_url}/llms.txt"
    llms_full_url = f"{base_url}/llms-full.txt"

    result = {
        "url": llms_url,
        "exists": False,
        "format_valid": False,
        "has_title": False,
        "has_description": False,
        "has_sections": False,
        "has_links": False,
        "section_count": 0,
        "link_count": 0,
        "content": "",
        "issues": [],
        "suggestions": [],
        "full_version": {"url": llms_full_url, "exists": False},
    }

    try:
        response = requests.get(llms_url, headers=DEFAULT_HEADERS, timeout=15)
        if response.status_code == 200:
            result["exists"] = True
            result["content"] = response.text
            lines = response.text.strip().split("\n")

            if lines and lines[0].startswith("# "):
                result["has_title"] = True
            else:
                result["issues"].append("Missing title (should start with '# Site Name')")

            for line in lines:
                if line.startswith("> "):
                    result["has_description"] = True
                    break
            if not result["has_description"]:
                result["issues"].append("Missing description (use '> Brief description')")

            sections = [l for l in lines if l.startswith("## ")]
            result["section_count"] = len(sections)
            result["has_sections"] = len(sections) > 0
            if not result["has_sections"]:
                result["issues"].append("No sections found")

            link_pattern = r"- \[.+\]\(.+\)"
            links = re.findall(link_pattern, response.text)
            result["link_count"] = len(links)
            result["has_links"] = len(links) > 0
            if not result["has_links"]:
                result["issues"].append("No page links found")

            result["format_valid"] = result["has_title"] and result["has_description"] and result["has_sections"] and result["has_links"]

            if result["link_count"] < 5:
                result["suggestions"].append("Consider adding more key pages (aim for 10-20)")
    except Exception as e:
        result["issues"].append(f"Error fetching llms.txt: {str(e)}")

    try:
        response = requests.get(llms_full_url, headers=DEFAULT_HEADERS, timeout=15)
        if response.status_code == 200:
            result["full_version"]["exists"] = True
    except Exception:
        pass

    return result


def generate_llmstxt(url: str, max_pages: int = 30) -> dict:
    """Generate an llms.txt file by crawling the site."""
    parsed = urlparse(url)
    base_url = f"{parsed.scheme}://{parsed.netloc}"

    result = {"generated_llmstxt": "", "generated_llmstxt_full": "", "pages_analyzed": 0, "sections": {}}

    try:
        response = requests.get(url, headers=DEFAULT_HEADERS, timeout=30)
        soup = BeautifulSoup(response.text, "lxml")
    except Exception as e:
        result["error"] = f"Failed to fetch homepage: {str(e)}"
        return result

    title = soup.find("title")
    site_name = title.get_text(strip=True).split("|")[0].split("-")[0].strip() if title else parsed.netloc
    meta_desc = soup.find("meta", attrs={"name": "description"})
    site_description = meta_desc.get("content", "") if meta_desc else f"Official website of {site_name}"

    pages = {"Main Pages": [], "Products & Services": [], "Resources & Blog": [], "Company": [], "Support": []}

    seen_urls = set()
    for link in soup.find_all("a", href=True):
        href = urljoin(base_url, link["href"])
        link_text = link.get_text(strip=True)
        if not link_text or len(link_text) < 2:
            continue
        parsed_href = urlparse(href)
        if parsed_href.netloc != parsed.netloc:
            continue
        if href in seen_urls:
            continue
        if any(ext in href for ext in [".pdf", ".jpg", ".png", ".gif", ".css", ".js"]):
            continue
        seen_urls.add(href)
        path = parsed_href.path.lower()
        page_entry = {"url": href, "title": link_text}

        if any(kw in path for kw in ["/pricing", "/feature", "/product", "/solution", "/demo"]):
            pages["Products & Services"].append(page_entry)
        elif any(kw in path for kw in ["/blog", "/article", "/resource", "/guide", "/learn", "/docs"]):
            pages["Resources & Blog"].append(page_entry)
        elif any(kw in path for kw in ["/about", "/team", "/career", "/contact", "/press"]):
            pages["Company"].append(page_entry)
        elif any(kw in path for kw in ["/help", "/support", "/faq"]):
            pages["Support"].append(page_entry)
        else:
            pages["Main Pages"].append(page_entry)

        if len(seen_urls) >= max_pages:
            break

    result["pages_analyzed"] = len(seen_urls)

    llms_lines = [f"# {site_name}", f"> {site_description}", ""]
    for section, section_pages in pages.items():
        if section_pages:
            llms_lines.append(f"## {section}")
            for page in section_pages[:10]:
                llms_lines.append(f"- [{page['title']}]({page['url']})")
            llms_lines.append("")

    llms_lines.extend(["## Contact", f"- Website: {base_url}", f"- Email: contact@{parsed.netloc}", ""])
    result["generated_llmstxt"] = "\n".join(llms_lines)

    result["sections"] = {k: len(v) for k, v in pages.items()}
    return result


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python llmstxt_generator.py <url> [mode]")
        print("Modes: validate (default), generate")
        sys.exit(1)

    target_url = sys.argv[1]
    mode = sys.argv[2] if len(sys.argv) > 2 else "validate"

    if mode == "validate":
        data = validate_llmstxt(target_url)
    elif mode == "generate":
        data = generate_llmstxt(target_url)
    else:
        print(f"Unknown mode: {mode}")
        sys.exit(1)

    print(json.dumps(data, indent=2, default=str))
