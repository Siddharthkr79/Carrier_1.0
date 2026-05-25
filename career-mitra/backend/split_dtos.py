import re
import os

with open('src/main/java/com/careermitra/dto/DTOs.java', 'r') as f:
    content = f.read()

classes = re.findall(r'(@Data.*?class\s+(\w+)\s*\{[^\}]*\})', content, re.DOTALL)

for class_content, class_name in classes:
    class_code = f"package com.careermitra.dto;\n\nimport lombok.AllArgsConstructor;\nimport lombok.Data;\nimport lombok.NoArgsConstructor;\n\n"
    # replace 'class ' with 'public class ' if not already
    class_body = class_content
    if 'public class' not in class_body:
        class_body = class_body.replace('class ' + class_name, 'public class ' + class_name)
    class_code += class_body + "\n"
    
    with open(f"src/main/java/com/careermitra/dto/{class_name}.java", "w") as out:
        out.write(class_code)

os.remove('src/main/java/com/careermitra/dto/DTOs.java')
