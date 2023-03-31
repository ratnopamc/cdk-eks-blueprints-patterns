import { Construct } from 'constructs';
import * as blueprints from '@aws-quickstart/eks-blueprints'
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { KubernetesVersion, NodegroupAmiType } from 'aws-cdk-lib/aws-eks';
import * as eks from "aws-cdk-lib/aws-eks";

import { VpcProvider } from '@aws-quickstart/eks-blueprints';


export default class Ipv6NetworkingConstruct {
    constructor(scope: Construct, id: string) {
        
       const clusterProvider = new blueprints.GenericClusterProvider({
            version: KubernetesVersion.V1_24,
            endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
            managedNodeGroups: [
                {
                    id: "x86-al2-on-demand-xl",
                    amiType: NodegroupAmiType.AL2_X86_64,
                    instanceTypes: [new ec2.InstanceType('m6i.xlarge')],
                    minSize: 1,
                    desiredSize: 2,
                    maxSize: 3,
                    nodeGroupSubnets: { subnetType: ec2.SubnetType.PUBLIC}
                }
            ]
        });        
        
        
        // AddOns for the cluster
        const stackId = `${id}-blueprint`;
        // myVpcId = 'vpc-027924fe005f1c3d6';
        //const existingIPV6Vpc = 'vpc-0dd1fab2cdd27c11a';
        

        
        blueprints.EksBlueprint.builder()
            .account(process.env.CDK_DEFAULT_ACCOUNT!)
            .region(process.env.CDK_DEFAULT_REGION)
            .resourceProvider(blueprints.GlobalResources.Vpc, new VpcProvider('vpc-0e6b82776380700d6'))
            .clusterProvider(clusterProvider)
            .addOns( new blueprints.MetricsServerAddOn(),
                new blueprints.VpcCniAddOn(),
                new blueprints.CoreDnsAddOn(),
                new blueprints.KubeProxyAddOn(),
            )
            .teams()
            .build(scope, stackId);
    }
}
