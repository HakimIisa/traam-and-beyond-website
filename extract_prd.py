import xml.etree.ElementTree as ET
import os

def extract_text_from_xml(xml_path):
    if not os.path.exists(xml_path):
        return f"File not found: {xml_path}"
    
    tree = ET.parse(xml_path)
    root = tree.getroot()
    
    # Namespaces
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    
    text = []
    for p in root.findall('.//w:p', ns):
        paragraph_text = []
        for t in p.findall('.//w:t', ns):
            if t.text:
                paragraph_text.append(t.text)
        if paragraph_text:
            text.append("".join(paragraph_text))
    
    return "\n".join(text)

xml_file = r'c:\Users\lenovo\AntiGravity Projects\traam-and-beyond\docs\PRD_content\word\document.xml'
content = extract_text_from_xml(xml_file)
print(content)
