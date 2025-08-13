from flask import Blueprint, jsonify, request, current_app
from app.langchain_services.comment_service import comment_chain, clean_ai_output

comment_bp = Blueprint("comment", __name__)

@comment_bp.route("/ai-comment", methods=["POST"])
def ai_comment():
    data = request.get_json()
    if not data or 'language' not in data or 'code' not in data:
        return jsonify({"error": "Request body must contain 'language' and 'code'"}), 400

    language = data['language']
    code_to_comment = data['code']

    try:
        commented_code_raw = comment_chain.invoke({
            "language": language,
            "code": code_to_comment
        })
        commented_code_clean = clean_ai_output(commented_code_raw)
        return jsonify({"commented_code": commented_code_clean}), 200
    except Exception as e:
        current_app.logger.error(f"Error invoking LangChain service: {e}")
        return jsonify({"error": "An internal error occurred while processing the code."}), 500