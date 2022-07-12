FROM php:8.0-apache

COPY config/apache/vhost.conf /etc/apache2/sites-available/vhost.conf

RUN apt-get update && apt-get upgrade -y
RUN docker-php-ext-install mysqli pdo pdo_mysql

RUN a2dissite 000-default.conf && a2ensite vhost.conf;
