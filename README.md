## 中文说明：

superset默认的ui没办法提供浏览器自适应，个性化图表渲染等功能，但是superset提供了一系列的API。所以我们可以使用这些API来定制适合我们自己需求的前端界面。

本项目依赖superset作为服务器，只要配置数据库和数据集就行。

开发的时候，需要修改vite的代理配置，生产环境需要自己配置跨域。

superset需要配置一下用户权限，只需要有数据库的访问权限（database access on [db_label_name].(id:3)）（superset中的配置）即可。

然后需要把public角色中的权限给清空，不要给匿名用户权限。

## English Description.

superset's default ui has no way to provide browser adaption, personalized chart rendering, etc. But superset provides a series of APIs. so we can use them to customize the front-end interface to suit our own needs.

This project relies on superset as the server, just configure the database and dataset.

When developing, you need to modify the proxy configuration of vite, and the production environment needs to configure cross-domain by itself.

The superset needs to be configured with user permissions, only the database access（database access on [db_label_name].(id:3)） (configured in superset) is required.

Then you need to clear the permissions in the public role and don't give anonymous user permissions.