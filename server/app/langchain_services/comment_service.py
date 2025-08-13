from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

prompt_template = ChatPromptTemplate.from_messages([
    ("system", "You are an expert programmer. Your task is to add clear and concise comments to the provided code. Only add comments where necessary to explain complex or non-obvious parts. Do not alter the original code logic. Return ONLY the full, updated code with your comments integrated, without any extra text or explanations."),
    ("human", "Please add comments to the following {language} code:\n\n```\n{code}\n```")
])

model = ChatGroq(model="llama3-8b-8192", temperature=0.3)

output_parser = StrOutputParser()

comment_chain = prompt_template | model | output_parser

def clean_ai_output(commented_code: str) -> str:
    if commented_code.strip().startswith("```") and commented_code.strip().endswith("```"):
        lines = commented_code.strip().split('\n')
        return '\n'.join(lines[1:-1])
    return commented_code.strip()