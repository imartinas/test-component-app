FROM nginx:1.23.1-alpine
COPY ./dist /var/www/test-component-app
RUN rm /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]