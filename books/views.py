from django.shortcuts import render
from rest_framework import generics
from .models import Book
from .serializers import BookSerializer

class BookListCreateAPIView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        # Filter by genre or read_status if provided in query parameters
        genre = self.request.query_params.get('genre')
        read_status = self.request.query_params.get('read_status')

        if genre:
            queryset = queryset.filter(genre__icontains=genre)
        if read_status:
            queryset = queryset.filter(read_status=read_status.lower() == 'true')

        return queryset


class BookRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

