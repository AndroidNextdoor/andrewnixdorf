#!/usr/bin/env python3

import json
from xml.etree.ElementTree import Element, SubElement, tostring
import zipfile
import os

def create_word_document():
    # Get the script directory and project root
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    
    # Read the site configuration
    config_path = os.path.join(project_root, 'assets', 'data', 'site.config.json')
    with open(config_path, 'r') as f:
        data = json.load(f)
    
    # Create the main document XML structure
    document = Element('w:document', {
        'xmlns:w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
    })
    
    body = SubElement(document, 'w:body')
    
    # Helper function to create a paragraph
    def add_paragraph(parent, text, style='Normal'):
        p = SubElement(parent, 'w:p')
        pPr = SubElement(p, 'w:pPr')
        pStyle = SubElement(pPr, 'w:pStyle')
        pStyle.set('w:val', style)
        r = SubElement(p, 'w:r')
        t = SubElement(r, 'w:t')
        t.text = text
        return p
    
    # Helper function to create a heading
    def add_heading(parent, text, level=1):
        p = SubElement(parent, 'w:p')
        pPr = SubElement(p, 'w:pPr')
        pStyle = SubElement(pPr, 'w:pStyle')
        pStyle.set('w:val', f'Heading{level}')
        r = SubElement(p, 'w:r')
        rPr = SubElement(r, 'w:rPr')
        b = SubElement(rPr, 'w:b')
        t = SubElement(r, 'w:t')
        t.text = text
        return p
    
    # Add header information
    add_heading(body, data['name'], 1)
    add_paragraph(body, data['role'])
    add_paragraph(body, 'LinkedIn: linkedin.com/in/andrewnixdorf | GitHub: github.com/AndroidNextdoor')
    add_paragraph(body, '')  # Empty line
    
    # Add professional summary
    add_heading(body, 'PROFESSIONAL SUMMARY', 2)
    add_paragraph(body, data['summary'])
    add_paragraph(body, '')
    
    # Add professional experience
    add_heading(body, 'PROFESSIONAL EXPERIENCE', 2)
    for exp in data['experience']:
        add_paragraph(body, f"{exp['title']} - {exp['company']} ({exp['period']})", 'Strong')
        for highlight in exp['highlights']:
            add_paragraph(body, f"• {highlight}")
        add_paragraph(body, '')
    
    # Add key projects
    add_heading(body, 'KEY PROJECTS', 2)
    for project in data['projects']:
        add_paragraph(body, project['title'], 'Strong')
        add_paragraph(body, project['description'])
        add_paragraph(body, f"Technologies: {', '.join(project['stack'])}")
        add_paragraph(body, '')
    
    # Add certifications if they exist
    if 'certifications' in data and data['certifications']:
        add_heading(body, 'CERTIFICATIONS', 2)
        for cert in data['certifications']:
            add_paragraph(body, cert['name'], 'Strong')
            add_paragraph(body, f"{cert['issuer']} - {cert['date']}")
            add_paragraph(body, '')
    
    # Add skills
    add_heading(body, 'CORE TECHNOLOGIES & SKILLS', 2)
    add_paragraph(body, ', '.join(data['keywords']))
    
    return tostring(document, encoding='unicode')

def create_content_types():
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
    <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
    <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>'''

def create_app_props():
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
    <Application>python-docx</Application>
    <ScaleCrop>false</ScaleCrop>
    <LinksUpToDate>false</LinksUpToDate>
    <SharedDoc>false</SharedDoc>
    <HyperlinksChanged>false</HyperlinksChanged>
    <AppVersion>16.0000</AppVersion>
</Properties>'''

def create_core_props():
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <dc:title>Andrew Nixdorf - Resume</dc:title>
    <dc:creator>Andrew Nixdorf</dc:creator>
    <dcterms:created xsi:type="dcterms:W3CDTF">2024-01-01T12:00:00Z</dcterms:created>
    <dcterms:modified xsi:type="dcterms:W3CDTF">2024-01-01T12:00:00Z</dcterms:modified>
</cp:coreProperties>'''

def create_main_rels():
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
    <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
    <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>'''

def create_document_rels():
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>'''

def create_styles():
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:style w:type="paragraph" w:styleId="Normal">
        <w:name w:val="Normal"/>
        <w:qFormat/>
        <w:pPr>
            <w:spacing w:after="200" w:line="276" w:lineRule="auto"/>
        </w:pPr>
        <w:rPr>
            <w:rFonts w:ascii="Calibri" w:eastAsia="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
            <w:sz w:val="22"/>
            <w:szCs w:val="22"/>
        </w:rPr>
    </w:style>
    <w:style w:type="paragraph" w:styleId="Heading1">
        <w:name w:val="heading 1"/>
        <w:basedOn w:val="Normal"/>
        <w:next w:val="Normal"/>
        <w:link w:val="Heading1Char"/>
        <w:uiPriority w:val="9"/>
        <w:qFormat/>
        <w:pPr>
            <w:keepNext/>
            <w:keepLines/>
            <w:spacing w:before="480" w:after="0"/>
        </w:pPr>
        <w:rPr>
            <w:rFonts w:ascii="Calibri Light" w:eastAsia="Calibri Light" w:hAnsi="Calibri Light" w:cs="Calibri Light"/>
            <w:b/>
            <w:bCs/>
            <w:color w:val="2F5496" w:themeColor="accent1" w:themeShade="BF"/>
            <w:sz w:val="32"/>
            <w:szCs w:val="32"/>
        </w:rPr>
    </w:style>
    <w:style w:type="paragraph" w:styleId="Heading2">
        <w:name w:val="heading 2"/>
        <w:basedOn w:val="Normal"/>
        <w:next w:val="Normal"/>
        <w:link w:val="Heading2Char"/>
        <w:uiPriority w:val="9"/>
        <w:unhideWhenUsed/>
        <w:qFormat/>
        <w:pPr>
            <w:keepNext/>
            <w:keepLines/>
            <w:spacing w:before="200" w:after="0"/>
        </w:pPr>
        <w:rPr>
            <w:rFonts w:ascii="Calibri Light" w:eastAsia="Calibri Light" w:hAnsi="Calibri Light" w:cs="Calibri Light"/>
            <w:b/>
            <w:bCs/>
            <w:color w:val="2F5496" w:themeColor="accent1" w:themeShade="BF"/>
            <w:sz w:val="26"/>
            <w:szCs w:val="26"/>
        </w:rPr>
    </w:style>
    <w:style w:type="paragraph" w:styleId="Strong">
        <w:name w:val="Strong"/>
        <w:basedOn w:val="Normal"/>
        <w:qFormat/>
        <w:rPr>
            <w:b/>
            <w:bCs/>
        </w:rPr>
    </w:style>
</w:styles>'''

def create_pdf_resume(project_root):
    import subprocess
    html_path = os.path.join(project_root, 'resume.html')
    pdf_path = os.path.join(project_root, 'assets', 'andrew-nixdorf-resume.pdf')
    
    # Ensure assets directory exists
    os.makedirs(os.path.dirname(pdf_path), exist_ok=True)
    
    # Try different Chrome/Chromium paths for different environments
    chrome_paths = [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',  # macOS
        '/usr/bin/google-chrome',  # Linux
        '/usr/bin/chromium-browser',  # Linux alternative
        'google-chrome',  # PATH
        'chromium'  # PATH alternative
    ]
    
    chrome_cmd = None
    for path in chrome_paths:
        try:
            if os.path.exists(path) or subprocess.run(['which', path.split('/')[-1]], 
                                                    capture_output=True, check=True):
                chrome_cmd = path
                break
        except (subprocess.CalledProcessError, FileNotFoundError):
            continue
    
    if not chrome_cmd:
        print("⚠️  Chrome/Chromium not found. Skipping PDF generation.")
        return False
    
    # Use Chrome to convert HTML to PDF
    cmd = [
        chrome_cmd,
        '--headless', '--disable-gpu', '--no-sandbox',
        f'--print-to-pdf={pdf_path}',
        '--print-to-pdf-no-header', '--no-margins',
        f'file://{html_path}'
    ]
    
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"PDF resume created successfully at: {pdf_path}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error creating PDF: {e}")
        return False

def main():
    # Get the script directory and project root
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    
    # Ensure assets directory exists
    assets_dir = os.path.join(project_root, 'assets')
    os.makedirs(assets_dir, exist_ok=True)
    
    docx_path = os.path.join(assets_dir, 'andrew-nixdorf-resume.docx')
    
    # Create the DOCX file
    with zipfile.ZipFile(docx_path, 'w', zipfile.ZIP_DEFLATED) as docx:
        # Add the main document
        document_xml = create_word_document()
        docx.writestr('word/document.xml', document_xml)
        
        # Add required files
        docx.writestr('[Content_Types].xml', create_content_types())
        docx.writestr('docProps/app.xml', create_app_props())
        docx.writestr('docProps/core.xml', create_core_props())
        docx.writestr('_rels/.rels', create_main_rels())
        docx.writestr('word/_rels/document.xml.rels', create_document_rels())
        docx.writestr('word/styles.xml', create_styles())
    
    print(f"DOCX resume created successfully at: {docx_path}")
    
    # Also create PDF version
    create_pdf_resume(project_root)

if __name__ == "__main__":
    main()