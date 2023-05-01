import { Construct } from 'constructs';
import * as blueprints from '@aws-quickstart/eks-blueprints'
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { CapacityType, KubernetesVersion, NodegroupAmiType } from 'aws-cdk-lib/aws-eks';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as eks from "aws-cdk-lib/aws-eks";
import { VpcProvider } from '@aws-quickstart/eks-blueprints';
import { DatadogAddOn } from '@datadog/datadog-eks-blueprints-addon';


export default class GravitonConstruct {
    constructor(scope: Construct, id: string) {
        const stackId = `${id}-blueprint`;
        const userData = ec2.UserData.forLinux();
        userData.addCommands(`/etc/eks/bootstrap.sh ${stackId}`);
        
        const clusterProvider = new blueprints.GenericClusterProvider({
            version: KubernetesVersion.V1_24,
            managedNodeGroups: [
                {
                    id: "mng1",
                    amiType: NodegroupAmiType.AL2_ARM_64,
                    instanceTypes: [new ec2.InstanceType('m6g.4xlarge')],
                    diskSize: 25,
                    desiredSize: 2,
                    maxSize: 3, 
                    nodeGroupSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }
                }
            ]
        });       

        blueprints.EksBlueprint.builder()
            .account(process.env.CDK_DEFAULT_ACCOUNT!)
            .region(process.env.CDK_DEFAULT_REGION)
            .addOns( new blueprints.VpcCniAddOn(),
                new blueprints.AwsLoadBalancerControllerAddOn(),
                new blueprints.CoreDnsAddOn(),
                new blueprints.KubeProxyAddOn(),
                new blueprints.AppMeshAddOn(),
                new blueprints.AckAddOn(),
                new blueprints.ArgoCDAddOn(),
                new blueprints.AwsBatchAddOn(),
                new blueprints.AwsForFluentBitAddOn(),
                //new blueprints.AwsNodeTerminationHandlerAddOn(),
                new blueprints.CertManagerAddOn(),
                //new blueprints.AWSPrivateCAIssuerAddon(),
            // new blueprints.KubeStateMetricsAddOn(),
            // new blueprints.PrometheusNodeExporterAddOn(),
            new blueprints.AdotCollectorAddOn(),
            new blueprints.AmpAddOn(),
            // new blueprints.XrayAdotAddOn(),
            new blueprints.CloudWatchAdotAddOn(),
            // new blueprints.IstioBaseAddOn(),
            // new blueprints.IstioControlPlaneAddOn(),
            new blueprints.CalicoOperatorAddOn(),
            new blueprints.ClusterAutoScalerAddOn(),
            new blueprints.ContainerInsightsAddOn(),
            new blueprints.EbsCsiDriverAddOn(),
            new blueprints.EfsCsiDriverAddOn(),
            new blueprints.ExternalsSecretsAddOn(),
            new blueprints.EmrEksAddOn(),
            
            // new blueprints.MetricsServerAddOn(),
            // new blueprints.SecretsStoreAddOn(),
            
            // new blueprints.SSMAgentAddOn(),
            // new blueprints.ExternalsSecretsAddOn(),
            // new blueprints.ExternalDnsAddOn({
            //     hostedZoneResources: [ blueprints.GlobalResources.HostedZone ]
            // })
            ).resourceProvider(blueprints.GlobalResources.Vpc, new VpcProvider())
            .clusterProvider(clusterProvider)
            .build(scope, stackId);
    }
}