import React, {useState} from 'react';
import {Plus, Save, Trash2, Copy, Play, Pause, Code, FileText, Settings} from 'lucide-react';
import {sampleRules, Rule} from './sampleRules';
import Editor from '@monaco-editor/react';


const Rules: React.FC = () => {
    const [rules, setRules] = useState<Rule[]>(sampleRules);
    const [isEditing, setIsEditing] = useState(false);
    const [showNewRuleModal, setShowNewRuleModal] = useState(false);

    const [newRuleName, setNewRuleName] = useState('');
    const [newRuleDescription, setNewRuleDescription] = useState('');
    const [newRuleType, setNewRuleType] = useState<'filter' | 'transform' | 'condition'>('filter');


    const [selectedRuleId, setSelectedRuleId] = useState<string>(sampleRules[0].id);
    const selectedRule = rules.find(r => r.id === selectedRuleId);


    // Add this function inside your component
    const handleCreateRule = () => {
        const newRule: Rule = {
            id: Date.now().toString(),
            name: newRuleName,
            description: newRuleDescription,
            type: newRuleType,
            code: '',
            status: 'draft',
            lastModified: new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        const updatedRules = [...rules, newRule];
        setRules(updatedRules);
        setSelectedRuleId(newRule.id);
        setShowNewRuleModal(false);
        console.log(newRule);

        setNewRuleName('');
        setNewRuleDescription('');
        setNewRuleType('filter');
    };

    const handleSaveRule = () => {
        if (selectedRule) {
            const updatedRules = rules.map(rule =>
                rule.id === selectedRule?.id
                    ? {
                        ...selectedRule,
                        lastModified: new Date().toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        })
                    }
                    : rule
            );
            setRules(updatedRules);
            // No need to update selectedRuleId since it stays the same
            setIsEditing(false);
        }
    };

    const handleCodeChange = (value: string | undefined) => {
        if (selectedRule && value !== undefined) {
            const updatedRules = rules.map(rule =>
                rule.id === selectedRuleId
                    ? {...rule, code: value}
                    : rule
            );
            setRules(updatedRules);
            // No need to update selectedRuleId since it stays the same
        }
    };

    const handleDeleteRule = (ruleId: string) => {
        const updatedRules = rules.filter(rule => rule.id !== ruleId);
        setRules(updatedRules);
        setSelectedRule(updatedRules.length > 0 ? updatedRules[0] : null);
    };

    const handleDuplicateRule = (rule: Rule) => {
        const newRule: Rule = {
            ...rule,
            id: Date.now().toString(),
            name: `${rule.name} (Copy)`,
            status: 'draft' as const,
            lastModified: new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        const updatedRules = [...rules, newRule];
        setRules(updatedRules);
        setSelectedRuleId(newRule.id);
    };

    const toggleRuleStatus = (ruleId: string) => {
        const updatedRules = rules.map(rule =>
            rule.id === ruleId
                ? {...rule, status: rule.status === 'active' ? 'paused' : 'active' as const}
                : rule
        );
        setRules(updatedRules);
        // No need to update selectedRuleId here
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-500';
            case 'paused':
                return 'bg-yellow-500';
            case 'draft':
                return 'bg-gray-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'filter':
                return <FileText className="h-4 w-4"/>;
            case 'transform':
                return <Settings className="h-4 w-4"/>;
            case 'condition':
                return <Code className="h-4 w-4"/>;
            default:
                return <Code className="h-4 w-4"/>;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'filter':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'transform':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'condition':
                return 'bg-green-50 text-green-700 border-green-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="h-full flex">
            {/* Rules List Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Rules</h1>
                            <p className="text-sm text-gray-600">Create and manage sync rules</p>
                        </div>
                        <button
                            onClick={() => setShowNewRuleModal(true)}
                            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4"/>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {rules.map((rule) => (
                        <div
                            key={rule.id}
                            onClick={() => setSelectedRuleId(rule.id)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                                selectedRuleId === rule.id
                                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            <div
                                className="flex items-start justify-between mb-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <div className={`status-dot ${getStatusColor(rule.status)}`}></div>
                                    <h3 className="font-medium text-gray-900 text-sm">{rule.name}</h3>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleRuleStatus(rule.id);
                                        }}
                                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                        {rule.status === 'active' ? (
                                            <Pause className="h-3 w-3"/>
                                        ) : (
                                            <Play className="h-3 w-3"/>
                                        )}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDuplicateRule(rule);
                                        }}
                                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                    >
                                        <Copy className="h-3 w-3"/>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteRule(rule.id);
                                        }}
                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="h-3 w-3"/>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-gray-600 mb-2">{rule.description}</p>
                            </div>

                            <div className="flex items-center justify-between">
                                <span
                                    className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getTypeColor(rule.type)}`}>
                                  {getTypeIcon(rule.type)}
                                    <span className="capitalize">{rule.type}</span>
                                </span>
                                <span className="text-xs text-gray-500">{rule.lastModified}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex flex-col">
                {selectedRule ? (
                    <>
                        {/* Editor Header */}
                        <div className="bg-white border-b border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">{selectedRule.name}</h2>
                                    <p className="text-sm text-gray-600 mt-1">{selectedRule.description}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveRule}
                                                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Save className="h-4 w-4"/>
                                                <span>Save</span>
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Code className="h-4 w-4"/>
                                            <span>Edit</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Monaco Editor */}
                        <div className="flex-1 bg-gray-50">
                            <Editor
                                height="100%"
                                defaultLanguage="javascript"
                                value={selectedRule.code}
                                onChange={handleCodeChange}
                                options={{
                                    readOnly: !isEditing,
                                    minimap: {enabled: false},
                                    fontSize: 14,
                                    lineNumbers: 'on',
                                    roundedSelection: false,
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    theme: 'vs-light',
                                    wordWrap: 'on',
                                    tabSize: 2,
                                    insertSpaces: true,
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <Code className="h-12 w-12 text-gray-300 mx-auto mb-4"/>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Rule Selected</h3>
                            <p className="text-gray-600">Select a rule from the sidebar to view and edit its code</p>
                        </div>
                    </div>
                )}
            </div>

            {/* New Rule Modal */}
            {showNewRuleModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Rule</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                                <input
                                    type="text"
                                    value={newRuleName}
                                    onChange={e => setNewRuleName(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Custom Filter Rule"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={newRuleDescription}
                                    onChange={e => setNewRuleDescription(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="Describe what this rule does..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Type</label>
                                <select
                                    value={newRuleType}
                                    onChange={e => setNewRuleType(e.target.value as 'filter' | 'transform' | 'condition')}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="filter">Filter - Include/exclude events</option>
                                    <option value="transform">Transform - Modify event data</option>
                                    <option value="condition">Condition - Apply conditional logic</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowNewRuleModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateRule}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create Rule
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rules;