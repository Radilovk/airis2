#!/usr/bin/env python3
"""
AIRIS Project Export Extractor (Python версия)
Конвертира JSON експорт към файлова структура

Usage: python3 extract-project.py <export-file.json>
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime


def print_separator():
    print('═' * 60)


def extract_project(json_file):
    print('🚀 AIRIS Project Extractor (Python)')
    print_separator()
    
    if not os.path.exists(json_file):
        print(f'❌ Файлът "{json_file}" не съществува!')
        sys.exit(1)
    
    print(f'📂 Четене на: {json_file}')
    
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(f'❌ Грешка при парсване на JSON: {e}')
        sys.exit(1)
    
    print(f'📦 Проект: {data["project"]}')
    export_date = datetime.fromisoformat(data['exportDate'].replace('Z', '+00:00'))
    print(f'📅 Експортиран на: {export_date.strftime("%Y-%m-%d %H:%M:%S")}')
    print(f'📊 Файлове: {data["totalFiles"]}')
    print(f'💾 Размер: {round(data["totalSize"] / 1024)}KB')
    print_separator()
    
    output_dir = 'airis-extracted'
    Path(output_dir).mkdir(exist_ok=True)
    
    success_count = 0
    error_count = 0
    
    for file_data in data['files']:
        try:
            file_path = Path(output_dir) / file_data['path']
            file_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(file_data['content'])
            
            success_count += 1
            file_size_kb = round(file_data['size'] / 1024)
            print(f'✅ {file_data["path"]} ({file_size_kb}KB)')
        except Exception as e:
            error_count += 1
            print(f'❌ Грешка при {file_data["path"]}: {e}')
    
    print_separator()
    print(f'✅ Успешно: {success_count} файла')
    if error_count > 0:
        print(f'❌ Грешки: {error_count} файла')
    print(f'📁 Извлечено в: {output_dir}/')
    print_separator()
    print()
    print('📝 Следващи стъпки:')
    print(f'   1. cd {output_dir}')
    print('   2. npm install')
    print('   3. npm run dev')
    print()
    print('🚀 Готово! Приложението ще стартира на http://localhost:5173')


def main():
    if len(sys.argv) < 2:
        print('Usage: python3 extract-project.py <export-file.json>')
        sys.exit(1)
    
    extract_project(sys.argv[1])


if __name__ == '__main__':
    main()
