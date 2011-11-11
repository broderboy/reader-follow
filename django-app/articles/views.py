from django.contrib.auth.decorators import login_required
from django.contrib.sites.models import Site
from django.core import serializers
from django.utils import simplejson 
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseNotFound
from django.shortcuts import get_object_or_404, render_to_response as r2r
from django.template import RequestContext, Context
from django.utils.encoding import smart_unicode
from django.views.decorators.cache import cache_page
import datetime
import settings
import time
from models import *
from django.views.decorators.csrf import csrf_exempt
#from pprint import pprint

debug = getattr(settings, 'DEBUG', None)

#def dump(obj):
#    '''return a printable representation of an object for debugging'''
#    newobj=obj
#    if '__dict__' in dir(obj):
#        newobj=obj.__dict__
#        if ' object at ' in str(obj) and not newobj.has_key('__type__'):
#            newobj['__type__']=str(obj)
#        for attr in newobj:
#            newobj[attr]=dump(newobj[attr])
#    return newobj

def invalid_post(data):
    invalid = ''
    tests = ['url', 'body', 'published_on', 'title']
    
    for test in tests:
        if test not in data:
            invalid = "%s %s," % (invalid, test)
        
    if invalid != '':
        return "Error: missing" + invalid.strip(',')
    return None

def convert_publish_date(in_string):
    in_format = "%b %d, %Y %I:%M %p"
    out_format = "%b %d, %Y %I:%M %p"
    in_converted = time.strptime(in_string,in_format)
    out_converted = time.strftime("%Y-%m-%d %H:%M", in_converted)
    return out_converted

#{
#    "url": "http: //www.google.com",
#    "body": "mybody",
#    "published_on": "Nov 1, 2011 2:24 PM",
#    "title": "my_title"
#}
@csrf_exempt
def post(request):
    if request.method != 'POST':
        return HttpResponseNotFound('<h1>expecting post</h1>')
    
    data = simplejson.loads(request.raw_post_data)
    
    is_invalid = invalid_post(data)
    if is_invalid:
        return HttpResponse("0")
        
    try:
        article = Article.objects.get(url = data['url'])
    except Article.DoesNotExist:
        published_on = convert_publish_date(data['published_on'])
        article = Article(url = data['url'], body = data['body'], published_on = published_on, title = data['title'])
        article.save()
    
    return HttpResponse('1')
    
    
def get(request, article_id):
    article = get_object_or_404(Article, id = article_id)
    data = serializers.serialize("json", [article, ])
    return HttpResponse(data)