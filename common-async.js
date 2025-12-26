((typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_suno-cover-arranger"] = (typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_suno-cover-arranger"] || []).push([
        ['common'],
{ "src/hooks/useApiKey.ts": function (module, exports, __mako_require__){
"use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "useApiKey", {
    enumerable: true,
    get: function() {
        return useApiKey;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
var _react = __mako_require__("node_modules/.pnpm/react@19.2.3/node_modules/react/index.js");
var _db = __mako_require__("src/services/db.ts");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
var _s = $RefreshSig$();
const useApiKey = ()=>{
    _s();
    const [apiKey, setApiKey] = (0, _react.useState)('');
    const [model, setModel] = (0, _react.useState)('deepseek');
    const [isLoading, setIsLoading] = (0, _react.useState)(true);
    const loadApiKeyForModel = async (targetModel)=>{
        try {
            console.log('Loading API Key for model:', targetModel);
            const userApiKeys = await _db.db.getUserApiKeys(1);
            console.log('All user API Keys:', userApiKeys);
            const modelApiKey = userApiKeys.find((key)=>key.model === targetModel);
            console.log('Found API Key for model', targetModel, ':', modelApiKey);
            setApiKey((modelApiKey === null || modelApiKey === void 0 ? void 0 : modelApiKey.api_key) || '');
            setModel(targetModel);
            console.log('Updating current API Key status for model', targetModel);
            for (const key of userApiKeys)await _db.db.updateApiKey(key.id, {
                is_current: key.model === targetModel
            });
        } catch (error) {
            console.error('Failed to load API Key for model:', targetModel, error);
            setApiKey('');
            setModel(targetModel);
        }
    };
    (0, _react.useEffect)(()=>{
        const loadInitialApiKeyAndModel = async ()=>{
            try {
                console.log('Loading initial API Key and Model...');
                const currentApiKey = await _db.db.getCurrentApiKey(1);
                if (currentApiKey) {
                    console.log('Found current API Key:', currentApiKey);
                    setApiKey(currentApiKey.api_key);
                    setModel(currentApiKey.model);
                } else {
                    console.log('No current API Key found, using default model deepseek');
                    await loadApiKeyForModel('deepseek');
                }
            } catch (error) {
                console.error('Failed to load initial API Key and Model:', error);
            } finally{
                setIsLoading(false);
            }
        };
        loadInitialApiKeyAndModel();
    }, []);
    const switchModel = async (newModel)=>{
        if (newModel === model) return;
        setIsLoading(true);
        await loadApiKeyForModel(newModel);
        setIsLoading(false);
    };
    const saveApiKey = async (newApiKey, newModel = 'deepseek')=>{
        try {
            console.log('Saving API Key and Model:', {
                apiKey: newApiKey,
                model: newModel
            });
            const savedApiKey = await _db.db.createApiKey({
                user_id: 1,
                api_key: newApiKey,
                model: newModel,
                is_current: true
            });
            console.log('Saved API Key and Model to DB:', savedApiKey);
            setApiKey(newApiKey);
            setModel(newModel);
            return true;
        } catch (error) {
            console.error('Failed to save API Key and Model:', error);
            return false;
        }
    };
    const deleteApiKey = async ()=>{
        try {
            console.log('Deleting API Key for model:', model);
            const userApiKeys = await _db.db.getUserApiKeys(1);
            const modelApiKey = userApiKeys.find((key)=>key.model === model);
            if (modelApiKey) {
                console.log('Deleting API Key with ID:', modelApiKey.id);
                await _db.db.deleteApiKey(modelApiKey.id);
            }
            setApiKey('');
            console.log('API Key deleted successfully');
            return true;
        } catch (error) {
            console.error('Failed to delete API Key:', error);
            return false;
        }
    };
    const validateApiKey = (apiKeyToValidate)=>{
        const deepSeekRegex = /^sk-/;
        const geminiRegex = /^AIza/;
        const mimoRegex = /^sk-/;
        const trimmedApiKey = apiKeyToValidate.trim();
        return deepSeekRegex.test(trimmedApiKey) || geminiRegex.test(trimmedApiKey) || mimoRegex.test(trimmedApiKey);
    };
    return {
        apiKey,
        model,
        isLoading,
        saveApiKey,
        deleteApiKey,
        validateApiKey,
        switchModel
    };
};
_s(useApiKey, "Jr7c2LGRsTXDtoSbEH3w7mK6Dbo=");
if (prevRefreshReg) self.$RefreshReg$ = prevRefreshReg;
if (prevRefreshSig) self.$RefreshSig$ = prevRefreshSig;
function registerClassComponent(filename, moduleExports) {
    for(const key in moduleExports)try {
        if (key === "__esModule") continue;
        const exportValue = moduleExports[key];
        if (_reactrefresh.isLikelyComponentType(exportValue) && exportValue.prototype && exportValue.prototype.isReactComponent) _reactrefresh.register(exportValue, filename + " " + key);
    } catch (e) {}
}
function $RefreshIsReactComponentLike$(moduleExports) {
    if (_reactrefresh.isLikelyComponentType(moduleExports || moduleExports.default)) return true;
    for(var key in moduleExports)try {
        if (_reactrefresh.isLikelyComponentType(moduleExports[key])) return true;
    } catch (e) {}
    return false;
}
registerClassComponent(module.id, module.exports);
if ($RefreshIsReactComponentLike$(module.exports)) {
    module.meta.hot.accept();
    _reactrefresh.performReactRefresh();
}

},
"src/services/db.ts": function (module, exports, __mako_require__){
/**
 * 数据库服务模块
 * 负责处理应用程序的本地数据库操作，使用 Dexie.js 作为数据库管理工具
 * 主要功能：
 * 1. 用户数据的增删改查
 * 2. 项目数据的管理
 * 3. 风格配置的存储和管理
 * 4. 提示词记录的保存和查询
 */ "use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
__mako_require__.e(exports, {
    db: function() {
        return db;
    },
    default: function() {
        return _default;
    }
});
var _interop_require_default = __mako_require__("@swc/helpers/_/_interop_require_default");
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = _interop_require_wildcard._(__mako_require__("node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js"));
var _dexie = _interop_require_default._(__mako_require__("node_modules/.pnpm/dexie@4.2.1/node_modules/dexie/import-wrapper.mjs"));
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
class AppDatabase extends _dexie.default {
    users;
    projects;
    styleConfigs;
    promptRecords;
    apiKeys;
    constructor(){
        super('SunoCoverArrangerDB');
        this.version(1).stores({
            users: '++id, name, email, created_at',
            projects: '++id, title, user_id, created_at, updated_at',
            styleConfigs: '++id, name, user_id, is_default, created_at, updated_at',
            promptRecords: '++id, user_id, created_at',
            apiKeys: '++id, user_id, api_key, model, is_current, created_at'
        });
        this.version(2).stores({
            promptRecords: '++id, userId, createdAt'
        });
        this.version(3).stores({
            users: '++id, name, email, created_at',
            projects: '++id, title, user_id, created_at, updated_at',
            styleConfigs: '++id, name, user_id, is_default, created_at, updated_at',
            promptRecords: '++id, user_id, created_at',
            apiKeys: '++id, user_id, api_key, model, is_current, created_at'
        }).upgrade(async (tx)=>{
            console.log('数据库升级到版本3，重新创建表结构');
        });
        this.version(4).stores({
            users: '++id, name, email, created_at',
            projects: '++id, title, user_id, created_at, updated_at',
            styleConfigs: '++id, name, user_id, is_default, created_at, updated_at',
            promptRecords: '++id, user_id, created_at',
            apiKeys: '++id, user_id, api_key, model, is_current, created_at'
        }).upgrade(async (tx)=>{
            console.log('数据库升级到版本4，统一字段命名规范为snake_case');
        });
        this.users = this.table('users');
        this.projects = this.table('projects');
        this.styleConfigs = this.table('styleConfigs');
        this.promptRecords = this.table('promptRecords');
        this.apiKeys = this.table('apiKeys');
    }
    async createUser(user) {
        const newUser = {
            ...user,
            createdAt: new Date()
        };
        const id = await this.users.add(newUser);
        return {
            ...newUser,
            id
        };
    }
    async getUser(id) {
        return this.users.get(id);
    }
    async updateUser(id, updates) {
        return this.users.update(id, updates);
    }
    async deleteUser(id) {
        await this.users.delete(id);
    }
    async getAllUsers() {
        return this.users.toArray();
    }
    async createProject(project) {
        const now = new Date();
        const newProject = {
            ...project,
            createdAt: now,
            updatedAt: now
        };
        const id = await this.projects.add(newProject);
        return {
            ...newProject,
            id
        };
    }
    async getProject(id) {
        return this.projects.get(id);
    }
    async updateProject(id, updates) {
        return this.projects.update(id, {
            ...updates,
            updatedAt: new Date()
        });
    }
    async deleteProject(id) {
        await this.projects.delete(id);
    }
    async getUserProjects(userId) {
        return this.projects.where('userId').equals(userId).toArray();
    }
    async createStyleConfig(config) {
        const now = new Date();
        const newConfig = {
            ...config,
            createdAt: now,
            updatedAt: now
        };
        if (newConfig.isDefault) await this.styleConfigs.where({
            userId: newConfig.userId,
            isDefault: true
        }).modify({
            isDefault: false,
            updatedAt: now
        });
        const id = await this.styleConfigs.add(newConfig);
        return {
            ...newConfig,
            id
        };
    }
    async getStyleConfig(id) {
        return this.styleConfigs.get(id);
    }
    async updateStyleConfig(id, updates) {
        const now = new Date();
        if (updates.isDefault) {
            const config = await this.styleConfigs.get(id);
            if (config) await this.styleConfigs.where({
                userId: config.userId,
                isDefault: true
            }).modify({
                isDefault: false,
                updatedAt: now
            });
        }
        return this.styleConfigs.update(id, {
            ...updates,
            updatedAt: now
        });
    }
    async deleteStyleConfig(id) {
        await this.styleConfigs.delete(id);
    }
    async getUserStyleConfigs(userId) {
        return this.styleConfigs.where('userId').equals(userId).toArray();
    }
    async getDefaultStyleConfig(userId) {
        return this.styleConfigs.where({
            userId,
            isDefault: true
        }).first();
    }
    async createPromptRecord(record) {
        const newRecord = {
            ...record,
            created_at: new Date()
        };
        const id = await this.promptRecords.add(newRecord);
        return {
            ...newRecord,
            id
        };
    }
    async getPromptRecord(id) {
        return this.promptRecords.get(id);
    }
    async updatePromptRecord(id, updates) {
        return this.promptRecords.update(id, updates);
    }
    async deletePromptRecord(id) {
        await this.promptRecords.delete(id);
    }
    async getUserPromptRecords(user_id, limit) {
        const query = this.promptRecords.where('user_id').equals(user_id).sortBy('created_at').then((records)=>records.reverse());
        if (limit) return (await query).slice(0, limit);
        return query;
    }
    async searchPromptRecords(user_id, keyword, limit) {
        const allRecords = await this.getUserPromptRecords(user_id);
        const filteredRecords = allRecords.filter((record)=>{
            const searchText = JSON.stringify(record).toLowerCase();
            return searchText.includes(keyword.toLowerCase());
        });
        if (limit) return filteredRecords.slice(0, limit);
        return filteredRecords;
    }
    async getRecentPromptRecords(user_id, days = 7) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return this.promptRecords.where('user_id').equals(user_id).and((record)=>(record.created_at || new Date(0)) >= cutoffDate).sortBy('created_at').then((records)=>records.reverse());
    }
    async createApiKey(apiKey) {
        console.log('Creating new API Key:', apiKey);
        const newApiKey = {
            ...apiKey,
            created_at: new Date()
        };
        if (newApiKey.is_current) {
            console.log('Setting new API Key as current, updating existing current keys...');
            await this.apiKeys.where({
                user_id: newApiKey.user_id,
                is_current: true
            }).modify({
                is_current: false
            });
        }
        const id = await this.apiKeys.add(newApiKey);
        const createdApiKey = {
            ...newApiKey,
            id
        };
        console.log('Created API Key:', createdApiKey);
        return createdApiKey;
    }
    async getApiKey(id) {
        return this.apiKeys.get(id);
    }
    async updateApiKey(id, updates) {
        if (updates.is_current) {
            const apiKey = await this.apiKeys.get(id);
            if (apiKey) await this.apiKeys.where({
                user_id: apiKey.user_id,
                is_current: true
            }).modify({
                is_current: false
            });
        }
        return this.apiKeys.update(id, updates);
    }
    async deleteApiKey(id) {
        await this.apiKeys.delete(id);
    }
    async getUserApiKeys(user_id) {
        return this.apiKeys.where('user_id').equals(user_id).toArray();
    }
    async getCurrentApiKey(user_id) {
        console.log('Getting current API Key for user:', user_id);
        const userApiKeys = await this.apiKeys.where('user_id').equals(user_id).toArray();
        console.log('All user API Keys:', userApiKeys);
        const currentApiKey = userApiKeys.find((key)=>key.is_current);
        console.log('Found current API Key:', currentApiKey);
        return currentApiKey;
    }
}
var _default = AppDatabase;
const db = new AppDatabase();
if (prevRefreshReg) self.$RefreshReg$ = prevRefreshReg;
if (prevRefreshSig) self.$RefreshSig$ = prevRefreshSig;
function registerClassComponent(filename, moduleExports) {
    for(const key in moduleExports)try {
        if (key === "__esModule") continue;
        const exportValue = moduleExports[key];
        if (_reactrefresh.isLikelyComponentType(exportValue) && exportValue.prototype && exportValue.prototype.isReactComponent) _reactrefresh.register(exportValue, filename + " " + key);
    } catch (e) {}
}
function $RefreshIsReactComponentLike$(moduleExports) {
    if (_reactrefresh.isLikelyComponentType(moduleExports || moduleExports.default)) return true;
    for(var key in moduleExports)try {
        if (_reactrefresh.isLikelyComponentType(moduleExports[key])) return true;
    } catch (e) {}
    return false;
}
registerClassComponent(module.id, module.exports);
if ($RefreshIsReactComponentLike$(module.exports)) {
    module.meta.hot.accept();
    _reactrefresh.performReactRefresh();
}

},
 }]);
//# sourceMappingURL=common-async.js.map