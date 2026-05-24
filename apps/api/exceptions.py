from rest_framework.views import exception_handler
from rest_framework.response import Response
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    
    if response is not None:
        logger.error(f"API Error: {exc} | Context: {context['view'].__class__.__name__}")
        response.data = {
            'error': True,
            'status_code': response.status_code,
            'message': response.data
        }
    return response