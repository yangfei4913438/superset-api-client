## 中文说明：

superset默认的ui没办法提供浏览器自适应，个性化图表渲染等功能，但是superset提供了一系列的API。所以我们可以使用这些API来定制适合我们自己需求的前端界面。

本项目依赖superset作为服务器，只要配置数据库和数据集就行。

开发的时候，需要修改vite的代理配置，生产环境需要自己配置跨域。（我不清楚superset是否支持开启跨域。）


## English Description.

superset's default ui has no way to provide browser adaption, personalized chart rendering, etc. But superset provides a series of APIs. so we can use them to customize the front-end interface to suit our own needs.

This project relies on superset as the server, just configure the database and dataset.

When developing, we need to modify the proxy configuration of vite, and the production environment needs to configure cross-domain itself. (I'm not sure if superset supports enabling cross-domain.)