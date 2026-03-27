import os
import re

def combine_assets():
    # Paths
    template_path = r'c:\Users\gokul\OneDrive\Desktop\weppage\templates\index.html'
    css_path = r'c:\Users\gokul\OneDrive\Desktop\weppage\static\css\style.css'
    js_path = r'c:\Users\gokul\OneDrive\Desktop\weppage\static\js\script.js'
    output_path = r'c:\Users\gokul\OneDrive\Desktop\weppage\combined.html'

    print(f"Reading template: {template_path}")
    if not os.path.exists(template_path):
        print(f"Error: {template_path} not found.")
        return

    with open(template_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Inlining CSS
    print(f"Reading CSS: {css_path}")
    if os.path.exists(css_path):
        with open(css_path, 'r', encoding='utf-8') as f:
            css_content = f.read()
        
        # Replace the CSS link tag
        # Look for: <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
        css_pattern = re.compile(r'<link\s+rel=["\']stylesheet["\']\s+href=["\']\{\{\s*url_for\([\'"]static[\'"],\s*filename=[\'"]css/style\.css[\'"]\)\s*\}\}["\']>')
        html_content = css_pattern.sub(f'<style>\n{css_content}\n</style>', html_content)
    else:
        print(f"Warning: {css_path} not found.")

    # Inlining JS
    print(f"Reading JS: {js_path}")
    if os.path.exists(js_path):
        with open(js_path, 'r', encoding='utf-8') as f:
            js_content = f.read()
        
        # Replace the JS script tag
        # Look for: <script src="{{ url_for('static', filename='js/script.js') }}"></script>
        js_pattern = re.compile(r'<script\s+src=["\']\{\{\s*url_for\([\'"]static[\'"],\s*filename=[\'"]js/script\.js[\'"]\)\s*\}\}["\']></script>')
        html_content = js_pattern.sub(f'<script>\n{js_content}\n</script>', html_content)
    else:
        print(f"Warning: {js_path} not found.")

    # Optional: Clean up other Flask-specific template tags if any (like url_for for images)
    # For now, we'll just leave them or the user might want them to stay as relative paths for local viewing
    # Replacing {{ url_for('static', filename='...') }} with static/...
    html_content = re.sub(r'\{\{\s*url_for\(\'static\',\s*filename=\'(.*?)\'\)\s*\}\}', r'static/\1', html_content)

    print(f"Saving combined HTML to: {output_path}")
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print("Success!")

if __name__ == "__main__":
    combine_assets()
