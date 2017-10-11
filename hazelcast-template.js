{
	"apiVersion": "v1",
	"kind": "Template",
	"metadata": {
		"name": "hazelcast-openshift",
		"annotations": {
			"description": "Openshift deployment template for Hazelcast",
			"tags": "hazelcast, imdg, datagrid, inmemory, kvstore, nosql, java",
			"iconClass": "icon-java"
		}
	},

	"labels": {
		"template": "hazelcast-openshift-template"
	},

	"objects": [{
		"apiVersion": "v1",
		"kind": "ReplicationController",
		"metadata": {
			"generateName": "hazelcast-cluster-rc-${DEPLOYMENT_NAME}-"
		},
		"spec": {
			"replicas": 3,
			"selector": {
				"name": "hazelcast-node-${DEPLOYMENT_NAME}"
			},
			"template": {
				"metadata": {
					"name": "hazelcast-node",
					"generateName": "hazelcast-node-${DEPLOYMENT_NAME}-",
					"labels": {
						"name": "hazelcast-node-${DEPLOYMENT_NAME}"
					}
				},
				"spec": {
					"containers": [{
						"image": "bibinwilson/hazelcast-prometheus:${HAZELCAST_VERSION}",
						"name": "hazelcast-openshift",
						"env": [{
							"name": "HAZELCAST_KUBERNETES_SERVICE_DNS",
							"value": "${SERVICE_NAME}.${NAMESPACE}.svc.${KUBERNETES_SERVICE_DOMAIN}"
						}, {
							"name": "HAZELCAST_KUBERNETES_SERVICE_NAME",
							"value": "${SERVICE_NAME}"
						}, {
							"name": "HAZELCAST_KUBERNETES_NAMESPACE",
							"value": "${NAMESPACE}"
						}, {
							"name": "HAZELCAST_KUBERNETES_SERVICE_DNS_IP_TYPE",
							"value": "IPV4"
						}],
						"ports": [{
							"containerPort": 5701,
							"protocol": "TCP"
						}],
						"ports": [{
							"containerPort": 5000,
							"protocol": "TCP"
						}]
					}]
				}
			},
			"triggers": {
				"type": "ImageChange"
			}
		}
	}, {
		"apiVersion": "v1",
		"kind": "Service",
		"metadata": {
			"name": "${SERVICE_NAME}"
		},
		"spec": {
			"type": "ClusterIP",
			"clusterIP": "None",
			"selector": {
				"name": "hazelcast-node-${DEPLOYMENT_NAME}"
			},
			"ports": [{
				"port": 5701,
				"protocol": "TCP"
			}],
			"ports": [{
				"port": 5000,
				"protocol": "TCP"
			}]
		}
	}],

	"parameters": [{
		"name": "DEPLOYMENT_NAME",
		"description": "Defines the base name of this deployment unit",
		"required": true
	}, {
		"name": "SERVICE_NAME",
		"description": "Defines the service name of the POD to lookup of Kubernetes.",
		"required": true
	}, {
		"name": "NAMESPACE",
		"description": "Defines the namespace of the application POD of Kubernetes.",
		"required": true
	}, {
		"name": "KUBERNETES_SERVICE_DOMAIN",
		"description": "Defines the domain part of a kubernetes dns lookup.",
		"value": "cluster.local",
		"required": true
	},{
        "name": "HAZELCAST_VERSION",
        "description": "Defines the hazelcast version.Default is latest. eg: 3.6.1",
        "value": "latest",
        "required": true
    }]
}
