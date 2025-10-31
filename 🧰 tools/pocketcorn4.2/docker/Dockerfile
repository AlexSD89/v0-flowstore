FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY src ./src
COPY tools ./tools
COPY config ./config
COPY data/samples ./data/samples

ENV PYTHONPATH=/app/src
CMD ["python", "tools/run_full_mission.py", "--output-json", "reports/docker_demo.json", "--output-md", "reports/docker_demo.md"]
